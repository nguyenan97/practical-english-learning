---
title: Lesson Template
---

# Lesson Template

Copy the following to a new lesson file. Replace every placeholder. The template itself is not a published lesson.

```yaml
---
layout: lesson
lang: en
title: <Natural English title>
lesson_id: EN-YYYYMMDD-slug
date: YYYY-MM-DD
order: <unique integer>
level: A2–B1
track: daily-life
track_label: Daily life
lesson_key: daily.function.specific-goal
anchor: <one communicative function or chunk family>
duration_minutes: 20
new_chunk_ids: [<3–5 existing chunk IDs>]
review_chunk_ids: []
prerequisite_lesson_ids: []
topic_tags: [<relevant tags>]
description: <short English description for the lesson card>
target: <observable English outcome>
scenario_id: <existing scenario ID>
---
```

Copy this body below the front matter. Lesson content uses English. The marker comments below must stay in the source.

````markdown
## Review — retrieve before reading

Give situation prompts for known chunks. If the learner has not practiced them, allow skipping; never invent learning history.

<!-- step -->

## Learn — one clear goal

Describe the roles, known facts and communication goal.

{% raw %}{% include chunk-cards.html %}{% endraw %}

Explain briefly, give everyday and work contexts, and contrast a common confusion.

<!-- step -->

## Practice — from support to independence

Add substitution, situation recall, Q → A with follow-up, correction, a scenario link, a changed situation, role reversal and personalization. Say answers before writing.

<!-- step -->

## Exit task — no notes

Use a new situation. Add observable success criteria and delayed recall after another short activity.

<!-- answers -->

## Answer key and sample responses

Provide answers for every task, including review, corrections, role reversal and the exit task. Label open responses as samples. Use correction categories: Must fix, Natural upgrade, Optional style.
````
