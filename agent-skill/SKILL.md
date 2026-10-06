---
name: daily-english-learning
description: Generate one new, non-duplicate English lesson per day, grounded first in project sources and learning history, then selectively enriched with current authoritative sources. USE FOR: daily English practice, speaking reflex, vocabulary-in-context, work/technical English, or review of previous lessons. DO NOT USE FOR: translation-only requests, unrelated writing tasks, or generic English answers that do not require the daily learning workflow.
---

# Daily English Learning

## Purpose

Produce one high-value English lesson per day that builds active English for thinking, speaking, listening, reading, and writing. The learner should move directly from situation/idea to English instead of translating from another language. Lessons must be practical, non-duplicate, source-grounded, practice-heavy, and increasingly personalized.

The target is not "know many translations". The target is:

**context -> meaning -> English chunk -> automatic retrieval -> natural use**

## Core behavior

1. Teach English through situations, chunks, collocations, questions, answers, and repeated retrieval.
2. Prefer high-frequency, high-utility English over rare vocabulary.
3. Use short, natural English that a real person would say.
4. During the lesson, use English only unless the learner explicitly asks for another language.
5. Separate **new learning** from **review**: the daily lesson must be new; old material may reappear only inside an explicit review/retrieval block.
6. Maximize learner output. Aim for roughly 70% learner practice and 30% explanation/input.
7. Do not overload one lesson. Go deep on a small number of useful chunks.
8. Correct unnatural English, not only grammatical errors.
9. Personalize examples toward the learner's real daily life and professional work when context is available.
10. Never claim a lesson is non-duplicate unless the learning history was actually checked.

## Source hierarchy

### Tier 1 - Project sources

Search the project learning sources first. Treat them as the curriculum foundation.

Prioritize:

- the multi-context learning method document;
- common phrase references as a phrase bank;
- speaking/reflex scenario material;
- project instructions and previous lesson history.

Rules:

- Preserve the project's existing principles: multi-context learning, chunks/collocations, Q -> A dialogue, active retrieval, English-only learning, daily-life and work contexts.
- Phrase banks are candidate material, not unquestioned truth. Verify unnatural, dated, or incorrect phrasing before teaching it as modern usage.
- Do not silently overwrite source content. If correcting or modernizing it, explicitly mark the improved form.

### Tier 2 - Authoritative language and learning-science sources

When expanding the method, prefer:

- university learning centers and peer-reviewed research;
- reputable language-learning research and corpus/dictionary sources;
- sources that support retrieval practice, spaced practice, interleaving, deliberate practice, chunking, contextual learning, and productive recall.

Do not add a learning technique just because it sounds plausible. Prefer techniques with clear evidence or strong pedagogical consensus.

### Tier 3 - Real technical English

For work/technical lessons, use current real-world sources instead of invented textbook technology examples.

Priority:

1. Microsoft Learn / Azure Architecture Center / official .NET documentation.
2. Official Angular documentation and repositories.
3. Official GitHub repositories for .NET, Azure, Angular, TypeScript, SQL tooling, or other technologies relevant to the lesson.
4. Mature third-party repositories only when they add practical value.

For GitHub research:

- Prefer official repos even if star count is lower.
- For third-party repos, favor active maintenance, clear licensing, recent commits/releases, useful documentation, and meaningful community adoption.
- Stars are a signal, not proof of quality.
- Never teach deprecated guidance simply because a repository is popular.

### Tier 4 - General web

Use only when the higher tiers do not answer the need. Cross-check important claims.

## Learning state and non-duplication

Maintain or reconstruct a learning log. Preferred file name: `english-learning-log.md`.

Each completed lesson should have metadata like:

```yaml
lesson_id: EN-YYYYMMDD-<slug>
date: YYYY-MM-DD
track: daily-life | work-communication | technical-english | social | travel | mixed
anchor: <word/chunk/function>
lesson_key: <normalized unique key>
topic_tags: [tag1, tag2, tag3]
new_chunks: [chunk1, chunk2, chunk3]
source_types: [project, microsoft, github, university, language-reference]
mastery: 0-4
weak_points: [optional]
review_due: [YYYY-MM-DD, ...]
```

### Duplicate rule

Before selecting a lesson:

1. Load all known `lesson_key`, `anchor`, `topic_tags`, and `new_chunks`.
2. Reject an exact `lesson_key` already completed.
3. Reject a lesson whose main communicative goal is substantially the same as a recent lesson, even if the title differs.
4. Reject a lesson that teaches the same anchor with the same dominant contexts.
5. A previously learned chunk may appear in the **Review** section, but it must not be counted as today's new chunk.
6. If history is unavailable, say that non-duplication can only be guaranteed within the accessible history.

### Lesson-key convention

Examples:

- `work.meeting.clarify-requirement`
- `daily.shopping.compare-options`
- `tech.azure.explain-caching-tradeoff`
- `social.smalltalk.follow-up-question`

## Curriculum rotation

Do not follow a rigid textbook chapter order. Select the next lesson using utility, novelty, weakness, and real-world usefulness.

Recommended rotation:

- Daily-life English
- Work communication
- Technical English / explain-back
- Social conversation
- Travel/service English
- Meeting/problem-solving English
- Integrated lesson using two previously learned skills in a new situation

Avoid two consecutive lessons with the same track unless the learner is fixing a weakness.

When several candidates are possible, prefer usefulness/frequency, real-life relevance, novelty, source quality, and weakness remediation.

## Daily workflow

### Step 1 - Read the learning context

Before teaching, check relevant sources and learning history. Identify recently learned anchors/chunks, recurring mistakes, approximate level, overdue review items, and recent lesson tracks.

Do not ask the learner to repeat information already available.

### Step 2 - Pick one new lesson

Choose one anchor concept. It may be:

- one high-frequency word with multiple contexts;
- one useful chunk/collocation family;
- one communicative function such as clarifying, disagreeing politely, reporting a problem, giving an update, or asking a follow-up question;
- one technical explain-back topic that teaches both useful English and real technical knowledge.

Prefer 2-5 new chunks per lesson rather than a long vocabulary list.

### Step 3 - Research only what improves the lesson

Use research when the lesson depends on current or real-world content. Research must serve the English objective; do not turn the lesson into a technical article.

### Step 4 - Build the lesson around retrieval and production

Use this order:

1. **Today's target** - one sentence describing what the learner will be able to say/do.
2. **Core idea** - simple English explanation, not a translation definition.
3. **New chunks** - 2-5 chunks with short usage notes.
4. **Multi-context examples** - at least daily-life + work/technical when natural.
5. **Why it works** - explain meaning/function inside each context.
6. **Q -> A dialogue** - natural short turns.
7. **Contrast** - compare with a previously learned word/chunk when useful.
8. **Real-world mini input** - a short current technical or real-life fact when relevant.
9. **Practice ladder** - learner must produce English.
10. **Review retrieval** - 2-4 prompts from due older material.
11. **Exit task** - one short speaking or writing task without looking at examples.

## Practice ladder

Practice should dominate the lesson. Escalate through several of these:

1. **Notice** - read short examples and identify the repeated chunk/function.
2. **Shadow** - speak short natural lines aloud.
3. **Substitution drill** - keep the sentence frame and replace one meaningful element.
4. **Retrieval prompt** - produce the target phrase from a situation.
5. **Q -> A drill** - answer one question at a time.
6. **Situation response** - respond to a realistic scenario in 1-3 sentences.
7. **Explain-back** - explain a technical concept simply in English.
8. **Personalization** - produce a sentence true about the learner's work/day.
9. **Constraint challenge** - use 2-3 target chunks in one natural response.
10. **Delayed recall** - retrieve chunks again near the end without seeing them.

Allow productive struggle before revealing answers.

## Spaced review

A new lesson is still required every day, but review should be mixed in.

Default review intervals after successful learning:

`1 -> 3 -> 7 -> 14 -> 30 -> 60 days`

If retrieval fails badly, shorten/reset the interval. Keep review roughly 20-30% of a normal lesson, interleave contexts, and prefer recall from situations over recognition questions.

## Speaking/voice mode

When the learner starts a speaking session:

1. Stay in role and use English.
2. Ask short, natural questions based on the current target.
3. Keep turns short enough to support speaking reflex.
4. If the learner asks "What should I say next?", give one concise hint/chunk, then continue after they repeat/respond.
5. Do not interrupt every sentence for correction unless the error blocks meaning.
6. Collect errors and give feedback at the end.

End-of-session feedback should cover fluency, naturalness, accuracy, vocabulary, and communication. Give corrected forms plus one short reason and one reusable example.

## Correction policy

Classify corrections into:

- **Must fix** - wrong meaning, serious grammar, misleading technical statement.
- **Natural upgrade** - understandable but not how people usually say it.
- **Optional style** - another valid way to say it.

Prefer:

`You said -> Better -> Why -> One reusable example`

Keep improvements slightly above the learner's current output rather than rewriting everything into advanced English.

## Technical-English mode

Good lesson types include explaining an API decision, clarifying a requirement, reporting a production issue, discussing trade-offs, summarizing a pull request, disagreeing with a design proposal politely, and explaining engineering concepts.

Rules:

1. Verify current technical claims from authoritative sources.
2. Teach the English used by engineers: verbs, collocations, hedging, cause/effect, trade-off language, and status-update language.
3. Prefer real documentation/README phrasing patterns, but paraphrase rather than copying long passages.
4. Make the learner explain the concept back in simple English.
5. Distinguish language correction from technical correction.

## Lesson length

Default to a compact but practice-heavy lesson that can be completed in about 15-25 focused minutes. Do not add a detailed study plan unless asked. Do not create a huge vocabulary dump.

## Output format

```markdown
# Lesson <N> - <Natural title>

**Today's target:** ...
**Track:** ...
**Anchor:** ...

## 1. Core idea
...

## 2. Useful chunks
...

## 3. Real contexts
### Daily life
...
### Work / technical
...

## 4. Why these phrases work
...

## 5. Q -> A
...

## 6. Practice
<interactive prompts; practice-heavy>

## 7. Review from older lessons
<due retrieval prompts only>

## 8. Exit task
<one no-notes production task>
```

If the learner explicitly requests a shorter lesson, preserve the practice block and reduce explanation/examples first.

## Validation

Before sending a daily lesson, verify:

- [ ] Sources/history were checked.
- [ ] `lesson_key` is not already completed.
- [ ] Main communicative goal is meaningfully new.
- [ ] New chunks are limited and high utility.
- [ ] Examples sound natural and fit real contexts.
- [ ] Any current technical claim was verified from authoritative sources.
- [ ] Practice requires active production, not only reading.
- [ ] Review is clearly separated from new material.
- [ ] The lesson is mostly English unless another language was requested.
- [ ] The lesson ends with an unassisted retrieval/production task.

## Failure modes

| Failure | Recovery |
|---|---|
| Learning history cannot be accessed | State the limitation and avoid claiming global non-duplication. Use only accessible history. |
| Source phrase conflicts with modern natural usage | Show the source form, then label and teach the modern/natural form. |
| Sources disagree | Prefer primary/official/current sources and note uncertainty briefly. |
| GitHub repo is popular but stale | Do not use it as best-practice evidence; find a maintained source. |
| Learner performs poorly | Reduce linguistic complexity, keep the same communicative function, add guided retrieval, then retry. |
| Learner performs very well | Increase response freedom, context switching, speed, and explain-back difficulty rather than merely adding rare vocabulary. |

## Completion

After a lesson is completed, update the learning state with lesson metadata, chunks actually produced correctly, errors worth revisiting, mastery score, and next review dates.

A lesson is not considered mastered because the learner read it. Mastery requires successful retrieval and use.
