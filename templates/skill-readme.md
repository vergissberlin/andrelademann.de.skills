# {{TITLE}}

{{DESCRIPTION}}

This skill is part of the [Vergissberlin Skills](https://github.com/vergissberlin/skills) catalog and is invoked as `{{NAME}}`.

## When to use

{{PURPOSE}}

## What it provides

- A focused `SKILL.md` workflow for the target task
- Repository metadata and a synchronized catalog entry
- Repeatable test prompts and acceptance criteria

## Repository files

| File | Purpose |
| --- | --- |
| [`SKILL.md`](./SKILL.md) | Agent instructions and workflow |
| [`metadata.json`](./metadata.json) | Catalog metadata |
| [`evals/evals.json`](./evals/evals.json) | Anthropic-style evaluation prompts |
| [`README.md`](./README.md) | Human-facing skill overview |

## Development

Run the repository checks from the project root:

```bash
cd tests
pnpm check:metadata
pnpm test:run
pnpm harness --skill {{NAME}} --mock
```

The docs site displays the generated harness result after the Pages preparation step creates `docs/src/data/harness-results.json`.

## Source

{{SOURCE}}
