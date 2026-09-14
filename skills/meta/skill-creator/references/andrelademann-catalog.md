# André Lademann Catalog Notes

Use these notes when applying this skill in the `vergissberlin/andrelademann.de.skills` repository.

## Required Catalog Updates

When adding or renaming a skill, keep these files aligned:

- `index.json`
- `docs/index.json`

For each skill entry:

- `name` must match frontmatter `name`
- `path` must end with `/<skill-name>/SKILL.md`
- `description` must be non-empty

## AGENTS.md Generator Mapping

When adding a skill, also update:

- `docs/src/pages/agent-md-generator.astro`

Add the skill name to the correct `domainMap` domain so the skill appears in generated AGENTS output.

## OG Asset Requirement

Every skill in `docs/index.json` needs:

- `docs/public/og/skills/<skill-name>.png`

The docs verification script checks this automatically.
