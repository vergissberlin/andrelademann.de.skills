# Skill Creator

Create, refine, test, document, and register skills in the Vergissberlin Skills repository.

This skill is part of the [Vergissberlin Skills](https://github.com/vergissberlin/skills) catalog and is invoked as `vergissberlin-skill-creator`.

## When to use

Use when turning a workflow into a reusable skill, improving an existing `SKILL.md`, adding skill tests, creating a skill README, or extending this catalog with a new skill.

## What it provides

- An Anthropic-inspired intent → draft → eval → review → iterate workflow
- A deterministic repository generator for skill files and catalog registration
- Local harness fixtures so the docs site can show test status
- A reusable README template for every generated skill

## Repository files

| File | Purpose |
| --- | --- |
| [`SKILL.md`](./SKILL.md) | Agent instructions and workflow |
| [`metadata.json`](./metadata.json) | Catalog metadata |
| [`evals/evals.json`](./evals/evals.json) | Anthropic-style evaluation prompts |
| [`scripts/create-skill.mjs`](./scripts/create-skill.mjs) | Deterministic repository generator |
| [`references/anthropic-method.md`](./references/anthropic-method.md) | Upstream workflow mapping |

## Development

```bash
cd tests
pnpm check:metadata
pnpm typecheck
pnpm test:run
pnpm harness --skill vergissberlin-skill-creator --mock --verbose
```

The docs detail page displays the harness result after CI generates `docs/src/data/harness-results.json`.

## Source

[Anthropic skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
