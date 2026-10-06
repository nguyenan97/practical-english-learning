# Practical English Learning

A context-first English learning repository focused on **active English**: thinking, speaking, listening, reading, and writing without sentence-by-sentence translation.

## Core idea

> situation / idea → English

> context → meaning → English chunk → automatic retrieval → natural use

The repository favors high-frequency English, chunks/collocations, multi-context learning, Q → A conversation, active retrieval, spaced review, speaking reflex, and practical technical English.

## Repository structure

```text
.
├── index.md
├── _config.yml
├── README.md
├── agent-skill/
│   ├── SKILL.md
│   └── source-policy.md
├── methods/
│   └── multi-context-vocabulary.md
├── sources/
│   ├── speaking-reflex-scenarios.md
│   └── common-phrases-reference.md
└── templates/
    └── learning-log-template.md
```

## Content-only source policy

Files under `sources/` are sanitized learning content, not document archives.

Conversion rules:

- keep pedagogically useful content;
- remove personal names and identifying details;
- remove company, organization, customer, project, account, and other identifying names;
- remove author/collector/uploader metadata;
- remove contact details, IDs, headers, footers, page numbers, watermarks, and provenance metadata;
- generalize named examples when identity is not needed for learning;
- preserve useful categories, phrases, scenarios, and teaching structure.

See `agent-skill/source-policy.md` for the full rule set.

## Agent Skill

`agent-skill/SKILL.md` defines the daily English learning workflow: source-first lesson selection, non-duplication, retrieval practice, spaced review, speaking mode, correction policy, and source sanitization.

## GitHub Pages

The repository includes Jekyll configuration and `index.md` so Markdown can be rendered as navigable HTML through GitHub Pages.

Expected site URL after Pages is enabled for the `main` branch/root:

`https://<owner>.github.io/practical-english-learning/`

The Pages home page links directly to the rendered learning method, sources, Agent Skill, source policy, and learning-log template.
