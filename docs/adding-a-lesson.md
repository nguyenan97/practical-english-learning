---
title: Add a Lesson
lang: en
---

# Add a lesson without updating several lists

## Sources of truth

- `lessons/*.md`: published lesson metadata and content.
- `_data/chunks.yml`: stable chunk IDs, meanings, examples, and situations.
- `_data/phrase_groups.yml`: situation groups in the phrase library.
- `scenarios/*.md`: roles, goals, partner turns, and changed situations.
- `templates/`: reusable authoring templates.
- `sources/`: sanitized learning sources; candidate wording is not automatically recommended usage.
- `methods/`: learning principles; `agent-skill/`: instructions for the agent.

The home page, lesson list, and conversation list are generated from front matter during the Jekyll build. A new lesson does not need several manually maintained navigation entries.

## Authoring workflow

1. Read existing lessons and private learning history if the learner provides it. Choose a different communicative goal. Without history, do not claim the learner has never studied it.
2. Choose 3–5 new chunks. Add stable IDs to `_data/chunks.yml`. Do not create a second ID for the same chunk to bypass duplicate checks.
3. Copy the [lesson template]({{ '/templates/lesson-template.html' | relative_url }}) to `lessons/YYYY-MM-DD-topic.md`. Fill in real metadata, a unique `order`, and valid references.
4. Write four steps using three `<!-- step -->` markers and one `<!-- answers -->` marker. Keep these comments unchanged; the layout uses them to divide the lesson.
5. Add a scenario from the [scenario template]({{ '/templates/scenario-template.html' | relative_url }}). Include 6–10 model turns, partner-only turns, one changed situation, and role reversal.
6. Answer every task. Label open-ended responses as samples and give observable success criteria.
7. Run validation and build the site. Check the home page, new lesson, phrase library, and scenario on wide and narrow screens.
8. Review naturalness, level, semantic novelty, and privacy. ID checks cannot replace editorial review.
9. Commit on a feature branch, push, and open a pull request. Keep actual learner logs out of the PR.

Use clear English throughout the interface, instructions, examples, and documentation. Keep language changes separate from stable IDs and storage keys so existing progress still resolves.

## Metadata

`lesson_id`, `lesson_key`, and `order` must be unique. `date` is the publication date, not the learner's completion date. `new_chunk_ids` and `review_chunk_ids` separate new learning from review. Add `prerequisite_lesson_ids` only when the lesson actually depends on that knowledge.

`scenario_id` points to the lesson's scenario. The scenario uses `lesson_id_ref` to link back. A chunk's `lesson_id` identifies the lesson that introduces it.

## Local checks

```sh
python3 -m pip install -r requirements-dev.txt
python3 scripts/validate-content.py
python3 scripts/test-validation.py
bundle install
bundle exec jekyll build
python3 scripts/validate-content.py --site _site
bundle exec jekyll serve
```

See the README for Playwright browser checks. CI validates and builds pull requests; the deployment workflow publishes changes only when they reach `main`.
