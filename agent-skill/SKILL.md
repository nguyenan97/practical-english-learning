---
name: daily-english-learning
description: >-
  Generate one new, non-duplicate English lesson per day, grounded first in learning sources and lesson history, then selectively enriched with current authoritative sources. USE FOR: daily English practice, speaking reflex, vocabulary-in-context, work/technical English, or review of previous lessons. DO NOT USE FOR: translation-only requests, unrelated writing tasks, or generic English answers that do not require the daily learning workflow.
title: Daily English Learning Agent Skill
---

# Daily English Learning

## Purpose

Produce one high-value English lesson per day that builds active English for thinking, speaking, listening, reading, and writing. Move directly from situation/idea to English instead of translating from another language.

**context -> meaning -> English chunk -> automatic retrieval -> natural use**

## Core behavior

1. Teach through situations, chunks, collocations, questions, answers, and repeated retrieval.
2. Prefer high-frequency, high-utility English over rare vocabulary.
3. Use short, natural English that a real person would say.
4. During lessons, use English only unless another language is explicitly requested.
5. Keep new learning separate from review.
6. Aim for roughly 70% learner practice and 30% explanation/input.
7. Go deep on a small number of useful chunks.
8. Correct unnatural English, not only grammar.
9. Personalize by situation and domain, but never expose private or identifying source data.
10. Never claim a lesson is non-duplicate unless learning history was checked.

## Source privacy and sanitization

Learning content must be portable and anonymous.

When ingesting or converting a source:

- keep only content needed for learning;
- remove author, collector, owner, uploader, learner, employee, client, and other personal names;
- remove company, organization, customer, project, hotel, product, and account names when they are identifying rather than pedagogically necessary;
- remove email addresses, phone numbers, addresses, IDs, usernames, URLs containing personal identifiers, and document metadata;
- replace identifying examples with neutral roles or generic placeholders only when the sentence needs the role to preserve meaning;
- do not copy headers, footers, page numbers, watermarks, attribution blocks, or provenance text into learning-source Markdown;
- keep geographic names only when they are essential to the language example; otherwise generalize them;
- do not infer or add personal facts that are absent from the learning content.

The sanitized Markdown source is the curriculum input. Original source metadata must not be required for lesson generation.

## Source hierarchy

### Tier 1 - Local learning sources

Use the repository learning sources first:

- multi-context learning method;
- common phrase bank;
- speaking/reflex scenarios;
- learning history.

Preserve these principles: multi-context learning, chunks/collocations, Q -> A dialogue, active retrieval, English-only learning, daily-life and work contexts.

Phrase banks are candidate material, not unquestioned truth. Verify unnatural, dated, or incorrect phrasing before teaching it as modern usage. If modernizing source wording, clearly distinguish the improved form.

### Tier 2 - Authoritative language and learning-science sources

Prefer university learning centers, peer-reviewed research, reputable corpus/dictionary sources, and evidence supporting retrieval practice, spaced practice, interleaving, deliberate practice, chunking, contextual learning, and productive recall.

### Tier 3 - Real technical English

For technical lessons, prefer current official documentation and official repositories. Use maintained third-party repositories only when they add practical value. Popularity is a signal, not proof of correctness.

### Tier 4 - General web

Use only when higher tiers do not answer the need. Cross-check important claims.

## Learning state and non-duplication

Read learner history only when it is actually provided. Keep private file history at `private/english-learning-log.md`, excluded from Git and the public build. Browser self-assessment is separate from curriculum metadata and is never available to the agent automatically. Do not reconstruct performance from page visits or published lessons.

```yaml
lesson_id: EN-YYYYMMDD-<slug>
date: YYYY-MM-DD
track: daily-life | work-communication | technical-english | social | travel | mixed
anchor: <word/chunk/function>
lesson_key: <normalized unique key>
topic_tags: [tag1, tag2, tag3]
new_chunks: [chunk1, chunk2, chunk3]
source_types: [local, official-docs, github, university, language-reference]
mastery: 0-4
weak_points: [optional]
review_due: [YYYY-MM-DD, ...]
```

Before selecting a lesson:

1. Load known `lesson_key`, `anchor`, `topic_tags`, and `new_chunks`.
2. Reject an exact `lesson_key` already completed.
3. Reject substantially repeated communicative goals.
4. Reject the same anchor with the same dominant contexts.
5. Previously learned chunks may appear only as review, not today's new material.
6. If history is incomplete, do not claim global non-duplication.

Example lesson keys:

- `work.meeting.clarify-requirement`
- `daily.shopping.compare-options`
- `tech.explain-caching-tradeoff`
- `social.smalltalk.follow-up-question`

## Curriculum rotation

Rotate among:

- Daily-life English
- Work communication
- Technical English / explain-back
- Social conversation
- Travel/service English
- Meeting/problem-solving English
- Integrated lessons combining previously learned skills in a new situation

Avoid two consecutive lessons with the same track unless fixing a weakness.

## Daily workflow

### 1. Read learning context

Check sanitized learning sources and learning history. Identify recently learned anchors/chunks, recurring mistakes, approximate level, overdue review items, and recent tracks.

### 2. Pick one new lesson

Choose one anchor concept:

- a high-frequency word across contexts;
- a useful chunk/collocation family;
- a communicative function;
- a technical explain-back topic.

Prefer 3-5 new chunks per published lesson; use stable IDs from `_data/chunks.yml`.

### 3. Research only when useful

Use current external research only when the lesson depends on current or real-world content. Research must serve the English objective.

### 4. Build around retrieval and production

Use the four-step published lesson workflow:

1. **Review (4 minutes)** — retrieval from situations for chunks actually practiced; allow skipping when history is unknown.
2. **Learn (4 minutes)** — target, situation, core idea, 3–5 chunks, everyday/work contexts, why they work and a useful contrast.
3. **Practice (8 minutes)** — substitution, situation recall, Q -> A, naturalness correction, an evolving 6–10-turn model dialogue, partner-only practice, a changed situation, role reversal and personalization.
4. **Exit task (4 minutes)** — unassisted production in a new situation, delayed recall and observable success criteria.

Put the complete answer key after the exit task. Open-ended answers are samples, not the only valid responses. Explain-back and real-world input can fit these steps when relevant. The timing is a flexible guide; learner production should occupy most of the session.

## Practice ladder

Escalate through several of these:

1. **Notice** - identify the repeated chunk/function.
2. **Shadow** - say short natural lines aloud.
3. **Substitution drill** - keep a frame and replace one meaningful element.
4. **Retrieval prompt** - produce a phrase from a situation.
5. **Q -> A drill** - answer one question at a time.
6. **Situation response** - respond in 1-3 sentences.
7. **Explain-back** - explain a concept simply in English.
8. **Personalization** - produce a sentence true for the current situation without exposing private source data.
9. **Constraint challenge** - use 2-3 target chunks naturally.
10. **Delayed recall** - retrieve chunks again without seeing them.

Allow productive struggle before revealing answers.

## Spaced review

Default intervals after successful learning:

`1 -> 3 -> 7 -> 14 -> 30 -> 60 days`

If retrieval fails badly, shorten/reset the interval. Keep review roughly 20-30% of a normal lesson and prefer recall from situations over recognition.

## Speaking/voice mode

1. Stay in role and use English.
2. Ask short, natural questions based on the target.
3. Keep turns short enough to support speaking reflex.
4. If asked `What should I say next?`, give one concise hint/chunk and continue after the response.
5. Do not interrupt every sentence unless an error blocks meaning.
6. Collect errors and give feedback at the end.

Feedback covers fluency, naturalness, accuracy, vocabulary, and communication as supported by the actual interaction. Do not assess pronunciation or listening from text alone. The website's scripted partner turns are not an AI service; use the copyable scenario prompt for adaptive AI practice.

## Correction policy

Classify corrections as:

- **Must fix** - wrong meaning, serious grammar, misleading technical statement.
- **Natural upgrade** - understandable but unnatural.
- **Optional style** - another valid expression.

Use:

`You said -> Better -> Why -> One reusable example`

Keep improvements slightly above current output rather than rewriting everything into advanced English.

## Technical-English mode

Useful lesson types include explaining a technical decision, clarifying a requirement, reporting an incident, discussing trade-offs, summarizing a change, disagreeing politely, and explaining engineering concepts.

Rules:

1. Verify current technical claims from authoritative sources.
2. Teach engineering English: verbs, collocations, hedging, cause/effect, trade-off language, and status-update language.
3. Paraphrase documentation rather than copying long passages.
4. Require explain-back in simple English.
5. Distinguish language correction from technical correction.
6. Keep examples generic unless identifying details are explicitly required for the exercise.

## Lesson length

Default to 15-25 focused minutes. Do not add a detailed study plan unless requested. Do not create a huge vocabulary dump.

## Output format

Use `templates/lesson-template.md` and `templates/scenario-template.md`. Publish a Markdown lesson with validated front matter and exactly three `<!-- step -->` markers followed by one `<!-- answers -->` marker. The layout renders the four steps and keeps answers at the end. Maintain a lesson/scenario link in both directions.

The home page and lesson index are generated from metadata. Do not maintain a duplicate list. Phrase metadata lives in `_data/chunks.yml`; all lesson IDs, new/review chunk IDs and prerequisites must resolve. A `lesson_id` represents curriculum content, not proof of completion. Dates in lesson front matter are publication dates.

Refer to `docs/adding-a-lesson.md` for the repository workflow and `docs/review-and-mastery.md` for the learner workflow.

## Validation

Before sending a lesson, verify:

- [ ] Sanitized sources/history were checked.
- [ ] No personal name, company name, account detail, or identifying metadata leaked from a source.
- [ ] `lesson_key` is not already completed.
- [ ] Main communicative goal is meaningfully new.
- [ ] New chunks are limited and high utility.
- [ ] Examples sound natural and fit real contexts.
- [ ] Current technical claims were verified when necessary.
- [ ] Practice requires active production.
- [ ] Review is clearly separated from new material.
- [ ] Lesson is mostly English unless another language was requested.
- [ ] Lesson ends with unassisted retrieval/production.

## Completion

After an actual learner attempt, record only observed output: chunks produced correctly, hints needed, errors worth revisiting, mastery score and next review date. If the task is only to author a lesson, do not create a completed learner entry. The static site offers explicit self-assessment; it does not grade speaking or infer success from navigation.

Mastery requires successful retrieval and use, not merely reading the lesson.
