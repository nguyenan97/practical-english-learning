# Daily English — Practical English Learning

About 20 minutes a day: **recall → learn a few phrases → practice a conversation → check your attempt**. Designed for A2–B1 learners who want to move from a situation directly to useful English.

## Start learning

Open the [website](https://nguyenan97.github.io/practical-english-learning/) and choose **Start today’s lesson**. Start with lesson 01 or pick a situation you need. Due reviews appear only after you save a self-assessment in that browser.

- [Start here](docs/start-here.md)
- [Your daily practice](docs/daily-routine.md)
- [Review and progress](docs/review-and-mastery.md)
- [Add a lesson](docs/adding-a-lesson.md)

Moving between steps does not mark mastery. After trying the exit task, choose a level from 0–4 and identify chunks you used correctly on your own. Progress stays in the current browser. There are no accounts, cross-device sync, or automatic speaking scores. With JavaScript off, you can still read and practice all lessons.

## Repository structure

```text
index.md                    # Today page
_layouts/                   # shared UI, home page, four-step lesson layout
_includes/                  # generated lists, chunk cards, partner-turn practice
_data/                      # canonical chunks and situation groups
assets/                     # responsive CSS and plain JavaScript
lessons/                    # complete lessons and a generated index
phrases/                    # searchable phrases grouped by situation
scenarios/                  # conversations, changed situations, AI practice prompts
sources/                    # sanitized reference material
methods/                    # learning principles
agent-skill/                # agent workflow and source policy
docs/                       # learner and contributor guides
templates/                  # lesson, scenario, and private learning-log templates
scripts/                    # curriculum validation and browser smoke checks
.github/workflows/          # pull-request checks and GitHub Pages deployment
```

Lesson examples use `_data/chunks.yml`. Repeating a phrase in a practice task is intentional; its metadata should not be maintained in several places. Lesson lists, scenario lists, and phrase-to-lesson links are generated from page metadata.

## Learning method

Use active recall, spaced practice, varied situations, personal examples, and delayed recall after another short activity. Each lesson introduces 3–5 chunks, separates review from new material, and includes speaking tasks, a conversation, and an answer key at the end.

The default successful-review offsets are 1, 3, 7, 14, 30, and 60 days. Weak retrieval brings review back to the next day. This is a starting schedule, not a guarantee of long-term recall for every learner.

All published interface copy, learning content, templates, and documentation use English. Keep explanations short enough for the target level. Review naturalness as well as grammar; understandable wording is not always the most useful conversational model.

## Run and verify

Requires Ruby 3.3, Bundler, and Python 3.

```sh
python3 -m pip install -r requirements-dev.txt
python3 scripts/validate-content.py
python3 scripts/test-validation.py
bundle install
bundle exec jekyll build
python3 scripts/validate-content.py --site _site
bundle exec jekyll serve
```

Open `http://localhost:4000/practical-english-learning/`. Asset and navigation URLs use `relative_url` to work under the repository path on GitHub Pages. Pull requests are checked in CI; only updates to `main` trigger deployment.

Browser smoke checks require Node, Playwright, and Chromium:

```sh
npm install --no-save --package-lock=false playwright
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium node scripts/smoke-ui.cjs
```

The script defaults to `http://127.0.0.1:4000/practical-english-learning/`. Set `TEST_BASE_URL` to test another deployment. Node is not required to build or use the website.

Validation checks metadata, unique IDs, chunk/scenario/prerequisite references, prerequisite cycles, chunk counts, the four-step structure, answers, English-only copy, and rendered local links. Browser checks exercise learning interactions, mobile layout, self-assessment, multi-tab progress, reset/export, overnight dates, and no-JavaScript/storage fallbacks. Editorial review still checks naturalness and distinct communicative goals.

## Privacy and sources

Keep real answers and learner logs out of Git. Store file-based logs in `private/`, which both Git and Jekyll exclude. Scratch files, scripts, dependencies, and private data are kept out of the published site. Skill and source pages remain available through the guide without crowding the daily learning flow.

Follow the [source policy](agent-skill/source-policy.md). Learning sources contain only sanitized content; lessons must not expose personal names, contact details, accounts, or identifying metadata.
