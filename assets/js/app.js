(() => {
  "use strict";
  const STATE_KEY = "daily-english-progress-v1";
  const RESUME_KEY = "daily-english-resume-v1";
  const intervals = [1, 3, 7, 14, 30, 60];
  const lessons = JSON.parse(
    document.getElementById("lesson-data")?.textContent || "[]",
  );
  const read = (key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      return data && typeof data === "object" && !Array.isArray(data)
        ? data
        : {};
    } catch {
      return {};
    }
  };
  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };
  const dateKey = (date = new Date()) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const addDays = (key, amount) => {
    const [year, month, day] = key.split("-").map(Number);
    const date = new Date(year, month - 1, day + amount, 12);
    return dateKey(date);
  };
  const validDate = (key) =>
    typeof key === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(key) &&
    Number.isFinite(new Date(`${key}T12:00:00`).getTime());
  const progress = {};
  const stored = read(STATE_KEY);
  lessons.forEach((lesson) => {
    const entry = stored[lesson.id];
    if (
      entry &&
      Number.isInteger(entry.mastery) &&
      entry.mastery >= 0 &&
      entry.mastery <= 4 &&
      validDate(entry.attemptedOn) &&
      validDate(entry.nextReview)
    )
      progress[lesson.id] = entry;
  });
  const today = dateKey();
  const due = lessons
    .filter((lesson) => progress[lesson.id]?.nextReview <= today)
    .sort((a, b) =>
      progress[a.id].nextReview.localeCompare(progress[b.id].nextReview),
    );
  const attempted = lessons.filter((lesson) => progress[lesson.id]);
  const unseen = lessons.find(
    (lesson) =>
      !progress[lesson.id] &&
      lesson.prerequisites.every((id) => progress[id]?.mastery >= 3),
  );
  const weak = lessons.find((lesson) => progress[lesson.id]?.mastery < 3);
  const suggested = due[0] || weak || unseen || lessons[0];
  const homeLink = document.getElementById("today-link");
  if (homeLink && suggested) {
    homeLink.href = suggested.url;
    document.getElementById("today-title").textContent = suggested.title;
    const isReview = Boolean(progress[suggested.id]);
    homeLink.textContent = `${isReview ? "Ôn bài hôm nay" : "Bắt đầu học hôm nay"} →`;
    document.getElementById("today-kind").textContent = due.length
      ? "Đến lượt ôn"
      : weak
        ? "Luyện lại một chút"
        : unseen
          ? "Bài tiếp theo"
          : "Tự chọn bài ôn";
    if (!attempted.length)
      document.getElementById("today-kind").textContent = "Bài đầu tiên";
    if (suggested.id !== lessons[0]?.id || isReview) {
      document.getElementById("today-description").textContent = isReview
        ? "Thử trả lời không nhìn mẫu, rồi tự đánh giá lại."
        : "Một tình huống mới. Đi từng bước và nói thành tiếng.";
      const example = document.querySelector(".today-example");
      example.querySelector("span").textContent = isReview
        ? "RECALL BEFORE READING"
        : "ONE SMALL STEP";
      example.querySelector("p").textContent = isReview
        ? "“What can I say in this situation?”"
        : "Read the situation. Try one sentence.";
    }
    if (attempted.length)
      document.getElementById("progress-summary").textContent =
        `Bạn đã tự đánh giá ${attempted.length}/${lessons.length} bài trên trình duyệt này. Đã đọc bài không đồng nghĩa đã nhớ.`;
    if (due.length) {
      document.getElementById("review-panel").hidden = false;
      const list = document.getElementById("review-list");
      due.forEach((lesson) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = lesson.url;
        link.textContent = lesson.title;
        li.append(link);
        list.append(li);
      });
    }
  }
  document.querySelectorAll("[data-lesson-state]").forEach((node) => {
    const entry = progress[node.dataset.lessonState];
    if (entry)
      node.textContent = `Đã tự thử · Mức ${entry.mastery}/4${entry.nextReview <= today ? " · Đến lượt ôn" : ""}`;
  });

  const workspace = document.querySelector(".lesson-workspace");
  const assessment = document.getElementById("assessment");
  const answerKey = document.getElementById("answer-key");
  if (workspace) {
    const steps = [...workspace.querySelectorAll(".lesson-step")];
    const nav = [...document.querySelectorAll("[data-step-link]")];
    const resume = read(RESUME_KEY);
    const saved = resume[workspace.dataset.lessonId];
    let active =
      Number.isInteger(saved) && saved >= 0 && saved < steps.length ? saved : 0;
    const previous = document.getElementById("previous-step");
    const next = document.getElementById("next-step");
    const hashStep = () =>
      /^#step-[1-4]$/.test(location.hash)
        ? Number(location.hash.slice(-1)) - 1
        : null;
    const show = (index, focus = false) => {
      if (index < 0 || index >= steps.length) return;
      active = index;
      steps.forEach((step, n) => {
        step.hidden = n !== index;
      });
      nav.forEach((link, n) => {
        if (n === index) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      previous.disabled = index === 0;
      next.hidden = index === steps.length - 1;
      document.getElementById("step-counter").textContent =
        `Bước ${index + 1} / ${steps.length}`;
      assessment.hidden = index !== steps.length - 1;
      answerKey.hidden = index !== steps.length - 1;
      if (index !== steps.length - 1) answerKey.open = false;
      resume[workspace.dataset.lessonId] = index;
      write(RESUME_KEY, resume);
      if (focus) {
        history.replaceState(null, "", `#step-${index + 1}`);
        steps[index].focus();
        steps[index].scrollIntoView({ block: "start" });
      }
    };
    document.body.classList.add("js-enabled");
    document.querySelector(".step-actions").hidden = false;
    nav.forEach((link, n) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        show(n, true);
      }),
    );
    previous.addEventListener("click", () => show(active - 1, true));
    next.addEventListener("click", () => show(active + 1, true));
    window.addEventListener("hashchange", () => {
      const n = hashStep();
      if (n !== null) show(n, true);
    });
    show(hashStep() ?? active);
  }
  document
    .getElementById("assessment-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const mastery = Number(document.getElementById("mastery").value);
      const old = progress[form.dataset.lessonId];
      const successfulOn =
        mastery >= 3
          ? validDate(old?.successfulOn)
            ? old.successfulOn
            : today
          : null;
      const nextReview = successfulOn
        ? intervals
            .map((n) => addDays(successfulOn, n))
            .find((day) => day > today) || addDays(today, 60)
        : addDays(today, 1);
      const produced = [
        ...form.querySelectorAll('[name="produced"]:checked'),
      ].map((input) => input.value);
      progress[form.dataset.lessonId] = {
        mastery,
        attemptedOn: today,
        successfulOn,
        nextReview,
        produced,
      };
      const status = document.getElementById("assessment-status");
      status.textContent = write(STATE_KEY, progress)
        ? `Đã lưu mức ${mastery}/4. Ôn lại vào ${nextReview.split("-").reverse().join("/")}. Nếu vẫn khó nhớ, luyện lại ngay với một tình huống khác.`
        : "Trình duyệt không cho lưu tiến độ. Bạn vẫn có thể học; hãy ghi kết quả vào learning log riêng.";
    });

  const search = document.getElementById("phrase-search");
  const groupFilter = document.getElementById("phrase-group-filter");
  if (search && groupFilter) {
    document.getElementById("phrase-controls").hidden = false;
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      document.querySelectorAll("[data-phrase-group]").forEach((group) => {
        let visible = 0;
        group.querySelectorAll(".phrase-card").forEach((card) => {
          const match =
            (!groupFilter.value ||
              groupFilter.value === group.dataset.phraseGroup) &&
            card.textContent.toLocaleLowerCase().includes(query);
          card.hidden = !match;
          if (match) visible += 1;
        });
        group.hidden = visible === 0;
        count += visible;
      });
      document.getElementById("phrase-count").textContent = count
        ? `${count} câu phù hợp. Chọn 1–3 câu để tự nói, không cần học tất cả.`
        : "Chưa tìm thấy câu phù hợp. Thử từ ngắn hơn hoặc chọn tất cả tình huống.";
    };
    search.addEventListener("input", filter);
    groupFilter.addEventListener("change", filter);
    filter();
  }
  document.querySelectorAll("[data-roleplay]").forEach((box) => {
    const turns = JSON.parse(box.querySelector("script").textContent);
    const prompt = box.querySelector(".roleplay-turn");
    const sample = box.querySelector(".roleplay-sample");
    const advance = box.querySelector("[data-turn-next]");
    let turn = 0;
    const render = () => {
      prompt.textContent = turns[turn].prompt;
      sample.textContent = "";
      sample.hidden = true;
      box.querySelector("[data-turn-count]").textContent =
        `Lượt ${turn + 1}/${turns.length}`;
      advance.textContent =
        turn === turns.length - 1 ? "Luyện lại từ đầu" : "Tôi đã trả lời →";
    };
    box.hidden = false;
    box.querySelector("[data-turn-hint]").addEventListener("click", () => {
      sample.textContent = turns[turn].hint;
      sample.hidden = false;
    });
    advance.addEventListener("click", () => {
      turn = (turn + 1) % turns.length;
      render();
      prompt.focus();
    });
    render();
  });
  document.getElementById("export-progress")?.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify({ version: 1, exportedOn: today, progress }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "daily-english-progress.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.getElementById("reset-progress")?.addEventListener("click", () => {
    if (
      !window.confirm(
        "Xóa tự đánh giá và vị trí học đã lưu trên trình duyệt này?",
      )
    )
      return;
    try {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem(RESUME_KEY);
      document.getElementById("privacy-status").textContent =
        "Đã xóa tiến độ trên trình duyệt này.";
    } catch {
      document.getElementById("privacy-status").textContent =
        "Trình duyệt không cho thay đổi dữ liệu lưu. Bạn có thể xóa dữ liệu trang trong cài đặt trình duyệt.";
    }
  });
})();
