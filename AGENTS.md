# AGENTS.md

This document defines the guardrails for agent work in this repository.

## Why this document exists

- Consistent and reproducible workflow for agent tasks
- Clear quality and security requirements
- Reliable collaboration between team and agent

## Principles

- Follow existing repository conventions
- Keep changes small, traceable, and validated
- Do not expose or persist secrets
- Understand first, then change
- Always document new or changed project rules in `AGENTS.md` (single source of truth for repository rules)

## GitHub Pages and releases

- The docs site is deployed by `.github/workflows/pages.yml` (Astro build under `docs/`; the job does **not** use the `github-pages` *environment* so that tag-based `release` events are not blocked by environment deployment rules; deploy uses `pages: write` and `id-token: write` on `GITHUB_TOKEN` only).
- If you reintroduce `environment: github-pages` on the deploy job, configure the environment so **tags are allowed to deploy** (e.g. Repository → **Settings** → **Environments** → **github-pages** → **Deployment branches and tags** → add a tag pattern such as `*`, or a semver pattern). Otherwise only `workflow_dispatch` from the default branch may work, and tag-driven runs fail with e.g. `Tag "X.Y.Z" is not allowed to deploy to github-pages due to environment protection rules`.
- Publishing a **GitHub Release** (not only creating a draft) runs that workflow: `on: release: types: [published]`, so a release-please tag release and a manually published release both trigger deploy.
- For ad-hoc deploys without a release, use **workflow dispatch** on the same workflow in the GitHub Actions UI.
- The deploy build copies `index.json` and `skills/` into `docs/` and generates the harness snapshot `docs/src/data/harness-results.json` before `pnpm build`.

## Skills and AGENTS.md Generator

- When adding a new skill, include the same change in the AGENTS.md generator: in `docs/src/pages/agent-md-generator.astro`, add the skill name (`name` from `index.json`) to `domainMap` under the matching work domain, or add a new domain with checkbox if needed. This ensures the skill appears in generated AGENTS.md output when that domain is selected in the generator.
- For release notes, use `feat(skills):` or `feature(skills):` when a change primarily adds or updates skills in `skills/`, `index.json`, or `docs/index.json`. The `skills` scope maps to the **Skills** changelog section and matches **minor** semver bumps like any other feature (release-please only treats `feat` / `feature` as minor, not a separate `skills:` type).
- Keep the catalog version in `index.json` aligned with release tags (`X.Y.Z`) and use pinned install commands such as `npx skills add vergissberlin/andrelademann.de.skills@X.Y.Z --skill <skill-name>`.
- Skill folders must be organized in nested directories. Do not add new flat paths like `skills/<skill-name>/SKILL.md`.
- Terraform skills must always be in:
  - `skills/terraform/code-generation/<skill-name>/SKILL.md`
  - `skills/terraform/module-generation/<skill-name>/SKILL.md`
  - `skills/terraform/provider-development/<skill-name>/SKILL.md`
- When adding a new Terraform domain folder under `skills/terraform/`, add or update a matching `.claude-plugin/plugin.json` for that domain, add/update the corresponding entry in `.claude-plugin/marketplace.json`, and review root `.claude-plugin/plugin.json` keywords/description.
- Place non-Terraform skills in matching domain folders, for example:
  - `skills/platform/<skill-name>/SKILL.md`
  - `skills/frontend/<skill-name>/SKILL.md`
  - `skills/data/<skill-name>/SKILL.md`
- Store a separate metadata file for each skill at `skills/<domain>/<skill-name>/metadata.json` with:
  - `title` (human-readable skill title)
  - `description` (short description in English)
  - `purpose` (short "use when" style purpose statement in English)
  - `tags` (array of concise topic tags, e.g. `["terraform", "testing"]`)
  - `source` (canonical upstream/source URL when applicable)
  - `version` (skill version string; align with SKILL.md frontmatter `version`)
- For new/moved/renamed skills, always keep `index.json` and `docs/index.json` (`path`) consistent.
- Every skill listed in `docs/index.json` must have an Open Graph preview at `docs/public/og/skills/<skill-name>.png`. In addition, `docs/public/og/default.png` is required for catalog and tool pages.
- OG design should follow the principles from `svg-logo-designer`: clear hierarchy, high contrast, readable skill name, and a consistent André Lademann look.

## Docs-Site UI Architecture

- Official brand tokens live in `brand/` (`colors.css`, `colors.json`, `tailwind.config.js`, `swatches/*.svg`). The docs app imports `brand/colors.css` from `docs/src/styles/tailwind.css` and exposes Tailwind v4 utilities as `kieks-*` (see `@theme` there).
- Typography: **Hanken Grotesk** (headings, nav, buttons) and **Source Sans 3** (body) load from Google Fonts in `docs/src/layouts/BaseLayout.astro`; `--font-heading` / `--font-sans` and optional self-host layout are documented in `brand/fonts/README.md`.
- Navbar logos live in `docs/public/brand/` as `andre-lademann-horizontal-aqua-light.svg` and `andre-lademann-horizontal-aqua-dark.svg`.
- For UI changes under `docs/src/`, use Atomic Design composition: `atoms -> molecules -> organisms -> templates -> pages`.
- Do not duplicate page-local markup when an existing atom or molecule can be reused.
- When adding or changing component props, update the related TypeScript prop definitions and the relevant docs text in the same change.
