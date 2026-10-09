# Working in this repository

Read `agent-skill/SKILL.md`, the source policy and `docs/adding-a-lesson.md` before changing learning content.

- Keep the site as static Jekyll + Markdown + plain CSS/JS. No backend is needed.
- Navigation and learning instructions may use Vietnamese. Lesson content, phrase examples and dialogues use natural English.
- Published lessons have exactly four steps separated by three `<!-- step -->` markers and one `<!-- answers -->` marker. Use the lesson template.
- `_data/chunks.yml` is the phrase metadata source. Lesson lists come from page metadata, not hand-maintained duplicates.
- Preserve existing examples and answers during migration. Keep new learning separate from review.
- Never fabricate learner history, mastery or answers. Page visits and step navigation do not demonstrate mastery.
- Keep private learner logs in `private/`, excluded from both Git and Jekyll. Never commit private state or local scratch files.
- Run `python3 scripts/validate-content.py`, `bundle exec jekyll build`, and built-site validation. Run browser checks when changing interactions.
- Use a feature branch and describe the actual validation in a PR. Do not merge without user authorization.
