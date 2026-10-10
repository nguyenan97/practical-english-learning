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
  const loadProgress = () => {
    const result = {};
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
        result[lesson.id] = entry;
    });
    return result;
  };
  const renderProgress = () => {
    const progress = loadProgress();
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
    const suggested = due[0] || weak || unseen || attempted[0] || lessons[0];
    const homeLink = document.getElementById("today-link");
    if (homeLink && suggested) {
      const isReview = Boolean(progress[suggested.id]);
      homeLink.href = suggested.url + (isReview ? "#step-4" : "");
      document.getElementById("quick-link").href =
        suggested.url + "#quick-practice";
      document.getElementById("today-title").textContent = suggested.title;
      document.getElementById("today-description").textContent =
        suggested.description;
      document.getElementById("today-goal").textContent = suggested.target;
      document.getElementById("today-cue").textContent = suggested.cue;
      homeLink.textContent = `${isReview ? "Review today" : "Start today’s lesson"} →`;
      document.getElementById("today-kind").textContent = due.length
        ? "Time to review"
        : weak
          ? "Practice again"
          : unseen
            ? "Your next lesson"
            : "Choose a lesson to revisit";
      if (!attempted.length)
        document.getElementById("today-kind").textContent = "Your first lesson";
      const entry = progress[suggested.id];
      document.getElementById("today-reason").textContent = due.length
        ? `Your saved review date is ${entry.nextReview}. Try this lesson’s exit task without notes before learning more.`
        : weak
          ? `You last saved level ${entry.mastery}/4 for this lesson. Try its exit task again; use one hint if you need it.`
          : !attempted.length
            ? "No self-assessments saved here yet. Start with lesson 01, or choose a situation you need."
            : unseen
              ? "Your saved reviews are not due yet. This is the next lesson with no self-assessment saved here."
              : "Nothing is due yet. Revisit this lesson, or choose another situation from the lesson list.";
      document.getElementById("progress-summary").textContent = attempted.length
        ? `You’ve assessed ${attempted.length}/${lessons.length} lessons in this browser. Reading a lesson is not the same as recalling it.`
        : "No progress saved yet. Start with lesson 01, or choose a situation you need today.";
      const lastAttempt = attempted
        .map((lesson) => progress[lesson.id].attemptedOn)
        .sort()
        .at(-1);
      document.getElementById("returning-note").hidden =
        !lastAttempt || lastAttempt >= addDays(today, -1);
      document.getElementById("review-panel").hidden = !due.length;
      const list = document.getElementById("review-list");
      list.replaceChildren();
      due.forEach((lesson) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = lesson.url + "#step-4";
        link.textContent = `${lesson.title} · due ${progress[lesson.id].nextReview}`;
        li.append(link);
        list.append(li);
      });
    }
    document.querySelectorAll("[data-lesson-state]").forEach((node) => {
      const entry = progress[node.dataset.lessonState];
      node.textContent = entry
        ? `Self-assessed · Level ${entry.mastery}/4 · ${entry.nextReview <= today ? "Time to review" : `Review ${entry.nextReview}`}`
        : "";
    });
  };
  renderProgress();
  window.addEventListener("storage", (event) => {
    if (event.key === STATE_KEY || event.key === null) renderProgress();
  });
  window.addEventListener("pageshow", renderProgress);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) renderProgress();
  });

  const workspace = document.querySelector(".lesson-workspace");
  const assessment = document.getElementById("assessment");
  const answerKey = document.getElementById("answer-key");
  if (workspace) {
    const steps = [...workspace.querySelectorAll(".lesson-step")];
    const nav = [...document.querySelectorAll("[data-step-link]")];
    const saved = read(RESUME_KEY)[workspace.dataset.lessonId];
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
        `Step ${index + 1} / ${steps.length}`;
      assessment.hidden = index !== steps.length - 1;
      answerKey.open = false;
      const resume = read(RESUME_KEY);
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
      // Another tab may have saved or cleared progress since this page opened.
      const latest = loadProgress();
      const attemptedOn = dateKey();
      const mastery = Number(document.getElementById("mastery").value);
      const old = latest[form.dataset.lessonId];
      const successfulOn =
        mastery >= 3
          ? validDate(old?.successfulOn)
            ? old.successfulOn
            : attemptedOn
          : null;
      const nextReview = successfulOn
        ? intervals
            .map((n) => addDays(successfulOn, n))
            .find((day) => day > attemptedOn) || addDays(attemptedOn, 60)
        : addDays(attemptedOn, 1);
      const produced = [
        ...form.querySelectorAll('[name="produced"]:checked'),
      ].map((input) => input.value);
      latest[form.dataset.lessonId] = {
        mastery,
        attemptedOn,
        successfulOn,
        nextReview,
        produced,
      };
      const status = document.getElementById("assessment-status");
      status.textContent = write(STATE_KEY, latest)
        ? `Saved level ${mastery}/4. Next review: ${nextReview}. If recall is still difficult, try a different situation now.`
        : "This browser cannot save progress. You can keep learning and record results in a private log.";
      renderProgress();
    });

  const openQuickPractice = () => {
    const quick = document.getElementById("quick-practice");
    if (quick && location.hash === "#quick-practice") quick.open = true;
  };
  openQuickPractice();
  window.addEventListener("hashchange", openQuickPractice);

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
        ? `${count} matching phrases. Pick 1–3 to say aloud; you do not need to learn them all.`
        : "No matching phrases. Try a shorter search or choose all situations.";
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
    const hint = box.querySelector("[data-turn-hint]");
    const finish = box.querySelector("[data-roleplay-finish]");
    let turn = 0;
    const render = () => {
      const done = turn === turns.length;
      prompt.hidden = done;
      hint.hidden = done;
      finish.hidden = !done;
      prompt.textContent = done ? "" : turns[turn].prompt;
      sample.textContent = "";
      sample.hidden = true;
      box.querySelector("[data-turn-count]").textContent = done
        ? "Next: change the situation"
        : `Turn ${turn + 1}/${turns.length}`;
      advance.textContent = done ? "Start again" : "I’ve replied →";
    };
    box.hidden = false;
    hint.addEventListener("click", () => {
      sample.textContent = turns[turn].hint;
      sample.hidden = false;
    });
    advance.addEventListener("click", () => {
      turn = turn === turns.length ? 0 : turn + 1;
      render();
      (turn === turns.length ? finish : prompt).focus();
    });
    render();
  });
  document.getElementById("export-progress")?.addEventListener("click", () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { version: 1, exportedOn: dateKey(), progress: loadProgress() },
          null,
          2,
        ),
      ],
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
        "Clear your saved self-assessments and lesson position in this browser?",
      )
    )
      return;
    try {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem(RESUME_KEY);
      document.getElementById("privacy-status").textContent =
        "Progress cleared in this browser.";
      renderProgress();
    } catch {
      document.getElementById("privacy-status").textContent =
        "This browser cannot change saved data. You can clear this site’s data in your browser settings.";
    }
  });
})();
