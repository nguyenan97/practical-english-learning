/* Exercise real learning interactions against a built Jekyll site. No learner data is committed. */
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base =
  process.env.TEST_BASE_URL ||
  "http://127.0.0.1:4000/practical-english-learning/";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
(async () => {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({ timezoneId: "Asia/Bangkok" });
  const page = await context.newPage();
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(base))
      failures.push(`${response.status()} ${response.url()}`);
  });
  // Retry only while the dev server starts; no fixed long sleep.
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(base);
      break;
    } catch (error) {
      if (attempt >= 30) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "How to learn" })
    .click();
  await page.waitForLoadState("load");
  assert.equal(
    await page
      .getByRole("heading", { name: "A little English you can use today" })
      .count(),
    1,
  );
  await page.goto(base);
  const lessons = await page
    .locator("#lesson-data")
    .evaluate((node) => JSON.parse(node.textContent));
  assert.ok(lessons.length >= 3);
  assert.equal(await page.locator("#review-panel").isVisible(), false);
  assert.match(
    await page.locator("#progress-summary").innerText(),
    /No progress saved/,
  );
  assert.match(
    await page.locator("#today-link").getAttribute("href"),
    /get-in-context/,
  );
  await page.locator("#today-link").click();
  await page.waitForLoadState("load");
  assert.equal(await page.locator(".lesson-step:visible").count(), 1);
  assert.equal(await page.locator("#assessment").isVisible(), false);
  assert.equal(await page.locator("#answer-key").isVisible(), false);
  await page.locator("#next-step").click();
  assert.equal(await page.locator("#step-2").isVisible(), true);
  await page.reload();
  assert.equal(await page.locator("#step-2").isVisible(), true);
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("daily-english-progress-v1"),
    ),
    null,
  );
  await page.locator("#next-step").click();
  await page.locator("#next-step").click();
  assert.equal(await page.locator("#step-4").isVisible(), true);
  assert.equal(await page.locator("#answer-key").getAttribute("open"), null);
  await page.locator("#mastery").selectOption("3");
  await page.locator("#attempt-confirmation").check();
  await page.locator('[name="produced"]').first().check();
  await page.getByRole("button", { name: "Save self-assessment" }).click();
  let saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("daily-english-progress-v1")),
  );
  assert.equal(saved[lessons[0].id].mastery, 3);
  assert.equal(saved[lessons[0].id].produced.length, 1);
  assert.ok(saved[lessons[0].id].nextReview > saved[lessons[0].id].attemptedOn);
  await page.locator("#answer-key > summary").click();
  assert.equal(await page.locator("#answer-key .prose").isVisible(), true);
  await page.goto(base);
  assert.match(
    await page.locator("#today-link").getAttribute("href"),
    /check-understanding/,
  );
  assert.ok(
    (await page.locator("#progress-summary").innerText()).includes(
      `1/${lessons.length}`,
    ),
  );
  // Existing local review state must determine due work, not publication dates.
  await page.evaluate((id) => {
    const data = JSON.parse(localStorage.getItem("daily-english-progress-v1"));
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const key = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    data[id].nextReview = key;
    localStorage.setItem("daily-english-progress-v1", JSON.stringify(data));
  }, lessons[0].id);
  await page.reload();
  assert.equal(await page.locator("#review-panel").isVisible(), true);
  assert.match(await page.locator("#today-link").innerText(), /Review/);
  await page.locator("#today-link").click();
  await page.waitForLoadState("load");
  await page.locator("#mastery").selectOption("1");
  await page.locator("#attempt-confirmation").check();
  await page.getByRole("button", { name: "Save self-assessment" }).click();
  saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("daily-english-progress-v1")),
  );
  assert.equal(saved[lessons[0].id].successfulOn, null);
  assert.equal(saved[lessons[0].id].mastery, 1);
  await page.goto(`${base}phrases/`);
  await page.locator("#phrase-group-filter").selectOption("planning");
  assert.ok((await page.locator(".phrase-card:visible").count()) >= 4);
  assert.equal(await page.locator("[data-phrase-group]:visible").count(), 1);
  await page.locator("#phrase-search").fill("no such phrase 9988");
  assert.equal(await page.locator(".phrase-card:visible").count(), 0);
  assert.match(
    await page.locator("#phrase-count").innerText(),
    /No matching phrases/,
  );
  await page.locator("#phrase-search").fill("");
  await page.goto(`${base}scenarios/check-understanding.html`);
  assert.equal(await page.locator("[data-roleplay]").isVisible(), true);
  assert.equal(await page.locator(".roleplay-sample").isVisible(), false);
  const firstTurn = await page.locator(".roleplay-turn").innerText();
  await page.getByRole("button", { name: "One hint" }).click();
  assert.equal(await page.locator(".roleplay-sample").isVisible(), true);
  await page.locator("[data-turn-next]").click();
  assert.notEqual(await page.locator(".roleplay-turn").innerText(), firstTurn);
  assert.equal(await page.locator(".roleplay-sample").isVisible(), false);
  // Verify each page on a phone: no horizontal page overflow or hidden primary links.
  await page.setViewportSize({ width: 390, height: 844 });
  const routes = [
    "",
    "lessons/",
    "phrases/",
    "scenarios/",
    "docs/start-here.html",
    "docs/review-and-mastery.html",
    ...lessons.map((item) => item.url.replace(new URL(base).pathname, "")),
  ];
  for (const route of routes) {
    await page.goto(new URL(route, base).href);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    const width = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    assert.ok(
      width.content <= width.viewport + 1,
      `${route}: page overflows (${width.content}/${width.viewport})`,
    );
  }
  await page.goto(`${base}docs/review-and-mastery.html`);
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download progress" }).click();
  assert.equal(
    (await downloadEvent).suggestedFilename(),
    "daily-english-progress.json",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear saved progress" }).click();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("daily-english-progress-v1"),
    ),
    null,
  );
  // Storage may be blocked. Learning must still work and saves must report the failure.
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked for test");
    };
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(new URL(lessons[1].url, base).href + "#step-4");
  await blockedPage.locator("#mastery").selectOption("2");
  await blockedPage.locator("#attempt-confirmation").check();
  await blockedPage
    .getByRole("button", { name: "Save self-assessment" })
    .click();
  assert.match(
    await blockedPage.locator("#assessment-status").innerText(),
    /cannot save progress/,
  );
  await blocked.close();
  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const plainPage = await plain.newPage();
  await plainPage.goto(new URL(lessons[0].url, base).href);
  assert.equal(await plainPage.locator(".lesson-step:visible").count(), 4);
  await plainPage.locator("#answer-key > summary").click();
  assert.equal(await plainPage.locator("#answer-key .prose").isVisible(), true);
  await plainPage.goto(`${base}scenarios/check-understanding.html`);
  await plainPage.locator(".partner-turns > summary").click();
  assert.ok(
    (await plainPage.locator(".partner-turns li:visible").count()) >= 3,
  );
  assert.equal(await plainPage.locator("[data-roleplay]").isVisible(), false);
  await plain.close();
  // Saving in separate tabs must preserve other lessons and respect a later reset.
  const tabs = await browser.newContext();
  const tabA = await tabs.newPage();
  const tabB = await tabs.newPage();
  await tabA.goto(new URL(lessons[0].url, base).href + "#step-4");
  await tabB.goto(new URL(lessons[1].url, base).href + "#step-4");
  const assess = async (tab, score) => {
    await tab.locator("#mastery").selectOption(String(score));
    await tab.locator("#attempt-confirmation").check();
    await tab.getByRole("button", { name: "Save self-assessment" }).click();
  };
  await assess(tabA, 3);
  await assess(tabB, 3);
  const multiTabState = await tabB.evaluate(() =>
    JSON.parse(localStorage.getItem("daily-english-progress-v1")),
  );
  assert.deepEqual(
    Object.keys(multiTabState).sort(),
    [lessons[0].id, lessons[1].id].sort(),
  );
  await tabB.goto(`${base}docs/review-and-mastery.html`);
  tabB.once("dialog", (dialog) => dialog.accept());
  await tabB.getByRole("button", { name: "Clear saved progress" }).click();
  const resetExportEvent = tabB.waitForEvent("download");
  await tabB.getByRole("button", { name: "Download progress" }).click();
  const resetExport = await resetExportEvent;
  const exportStream = await resetExport.createReadStream();
  const buffers = [];
  for await (const buffer of exportStream) buffers.push(buffer);
  assert.deepEqual(JSON.parse(Buffer.concat(buffers).toString()).progress, {});
  await assess(tabA, 2);
  const afterReset = await tabA.evaluate(() =>
    JSON.parse(localStorage.getItem("daily-english-progress-v1")),
  );
  assert.deepEqual(Object.keys(afterReset), [lessons[0].id]);
  await tabs.close();
  // A tab left open across midnight must record the day of the actual attempt.
  const overnight = await browser.newContext({ timezoneId: "Asia/Bangkok" });
  const overnightPage = await overnight.newPage();
  await overnightPage.clock.install({ time: new Date("2026-10-09T16:58:00Z") });
  await overnightPage.goto(new URL(lessons[0].url, base).href + "#step-4");
  await overnightPage.clock.setSystemTime(new Date("2026-10-09T17:05:00Z"));
  await assess(overnightPage, 2);
  const overnightState = await overnightPage.evaluate(() =>
    JSON.parse(localStorage.getItem("daily-english-progress-v1")),
  );
  assert.equal(overnightState[lessons[0].id].attemptedOn, "2026-10-10");
  assert.equal(overnightState[lessons[0].id].nextReview, "2026-10-11");
  await overnight.close();
  assert.deepEqual(failures, [], "Browser errors and failed local requests");
  console.log(
    "UI smoke checks passed: learning flow, mobile, no-JS/storage fallbacks, multi-tab saves, export after reset and overnight assessment dates.",
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
