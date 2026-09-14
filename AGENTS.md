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

- When Release Please creates a release, `.github/workflows/release-please.yml` calls both the Pages and wiki reusable workflows directly with the new tag. Keep these calls in the release workflow rather than relying on events created by `GITHUB_TOKEN`, because GitHub suppresses most recursive workflow events from that token.
- Wiki content is mirrored with `rsync --delete`, but the wiki checkout's `.git/` directory must always be excluded so the subsequent commit and push can run.
- The docs site is deployed by `.github/workflows/pages.yml` (Astro build under `docs/`; the job does **not** use the `github-pages` *environment* so that tag-based `release` events are not blocked by environment deployment rules; deploy uses `pages: write` and `id-token: write` on `GITHUB_TOKEN` only).
- If you reintroduce `environment: github-pages` on the deploy job, configure the environment so **tags are allowed to deploy** (e.g. Repository → **Settings** → **Environments** → **github-pages** → **Deployment branches and tags** → add a tag pattern such as `*`, or a semver pattern). Otherwise only `workflow_dispatch` from the default branch may work, and tag-driven runs fail with e.g. `Tag "X.Y.Z" is not allowed to deploy to github-pages due to environment protection rules`.
- Publishing a **GitHub Release** manually (not only creating a draft) runs the Pages workflow through `on: release: types: [published]`; Release Please invokes it directly as a reusable workflow instead.
- For ad-hoc deploys without a release, use **workflow dispatch** on the same workflow in the GitHub Actions UI.
- The deploy build copies `index.json` and `skills/` into `docs/` and generates the harness snapshot `docs/src/data/harness-results.json` before `pnpm build`.

## Skills

- Using the blog-post skill (`andrelademann-blog-post-writer`) must also activate and follow `andrelademann-blog-header-image` in the same task, unless the user supplies an image, explicitly opts out, or explicitly requests a separate visual task.
- For release notes, use `feat(skills):` or `feature(skills):` when a change primarily adds or updates skills in `skills/`, `index.json`, or `docs/index.json`. The `skills` scope maps to the **Skills** changelog section and matches **minor** semver bumps like any other feature (release-please only treats `feat` / `feature` as minor, not a separate `skills:` type).
- Keep the catalog version in `index.json` and every skill version in `SKILL.md` frontmatter and `metadata.json` aligned with release tags (`X.Y.Z`). Register both version-bearing skill files in `release-please-config.json` whenever adding a skill so Release Please updates them together. Use pinned install commands such as `npx skills add vergissberlin/andrelademann.de.skills@X.Y.Z --skill <skill-name>`.
- Skill folders must be organized in nested directories. Do not add new flat paths like `skills/<skill-name>/SKILL.md`.
- Place skills in matching domain folders, for example:
  - `skills/blog/<skill-name>/SKILL.md`
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
- Keep the copy-ready integration templates under `integrations/` and `.github/copilot-instructions.md` aligned with `index.json`, the referenced `SKILL.md` files, and `.claude-plugin/marketplace.json` when skills change.

## Docs-Site UI Architecture

- Official brand tokens live in `brand/` (`colors.css`, `colors.json`, `tailwind.config.js`, `swatches/*.svg`). The docs app imports `brand/colors.css` from `docs/src/styles/tailwind.css` and exposes Tailwind v4 utilities as `kieks-*` (see `@theme` there).
- Typography: **Hanken Grotesk** (headings, nav, buttons) and **Source Sans 3** (body) load from Google Fonts in `docs/src/layouts/BaseLayout.astro`; `--font-heading` / `--font-sans` and optional self-host layout are documented in `brand/fonts/README.md`.
- The site identity portrait lives at `docs/public/brand/andre-lademann.webp`; keep its square crop and accessible text lockup in the navbar and footer.
- Favicon and apple-touch-icon use `docs/public/brand/andre-lademann-favicon.png` (mug-only crop on navy, not the portrait). Keep PWA icons (`docs/public/pwa-192x192.png`, `docs/public/pwa-512x512.png`) derived from the same mug mark.
- For UI changes under `docs/src/`, use Atomic Design composition: `atoms -> molecules -> organisms -> templates -> pages`.
- Do not duplicate page-local markup when an existing atom or molecule can be reused.
- When adding or changing component props, update the related TypeScript prop definitions and the relevant docs text in the same change.
