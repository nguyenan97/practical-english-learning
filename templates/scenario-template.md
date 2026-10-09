---
title: Scenario Template
---

# Scenario Template

Copy to `scenarios/<stable-id>.md`. Replace placeholders and add 3–5 partner turns.

```yaml
---
layout: default
title: <Natural situation title>
scenario_id: <stable-id>
lesson_id_ref: <existing lesson ID>
level: A2–B1
turns:
  - prompt: <One natural partner turn>
    hint: <One short chunk or hint, not the full answer>
---
```

````markdown
# <Situation title>

## Situation and goal

State who speaks, what is known, and what the learner needs to achieve.

## Your turn

{% raw %}{% include roleplay.html %}{% endraw %}

## Change the situation and switch roles

Give a changed detail, a sample response, and instructions for the learner to play the other role.

<details markdown="1">
<summary>Model dialogue — read after your attempt</summary>

Write 6–10 connected, short turns for both roles.

</details>

## Practice with an AI partner

Provide a copyable prompt that gives one partner turn at a time, waits for the learner, adapts to actual responses, offers one short hint on request and gives feedback at the end. Do not claim pronunciation or listening assessment from text alone.
````
