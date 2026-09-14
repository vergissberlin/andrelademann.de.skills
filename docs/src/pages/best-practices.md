---
layout: ../layouts/MarkdownPageLayout.astro
title: Best Practices | Skills
description: Best practices for Agent Skills.
heading: Best Practices
subtitle: Guidelines for discoverable, safe, and maintainable Agent Skills.
---

## Naming

- Use `kebab-case` for skill folders.
- Keep skill names close to the real use case (for example `iac-infrastructure-as-code`).
- Use practical trigger words in descriptions.

## Discoverability

- Start each `SKILL.md` with precise frontmatter (`name`, `description`, `version`).
- Describe clearly when the skill should be invoked.
- Add realistic example inputs to improve routing quality.
- When you add a skill to the catalog, also map it in the AGENTS.md generator: update `domainMap` in `docs/src/pages/agent-md-generator.astro` so the skill is tied to the right working domain (or add a domain). The catalog list comes from `index.json`; domain selection drives which install commands appear in generated AGENTS.md files.
- Create one Open Graph preview image per skill at `docs/public/og/skills/<skill-name>.png` (where `<skill-name>` matches `name` in `index.json`).
- Keep `docs/public/og/default.png` as the fallback preview for catalog and utility pages.
- Follow `svg-logo-designer` principles for OG compositions: clear visual hierarchy, high contrast, readable labels, and consistent brand style.
- Use a 1200×630 PNG export for social crawlers, even if your editable source is SVG.

## Versioning

- Use semantic versioning in skill frontmatter (for example `version: 1.0.0`).
- Mark breaking changes explicitly.
- Optionally use Git tags for skill releases.

## Security and Safe Execution

- Avoid destructive defaults.
- Analyze first, then propose changes.
- Document scope and allowed tool categories.
- Never expose or persist secrets.

## Progressive Disclosure

1. Load only name and description into the global context first.
2. Load `SKILL.md` on demand.
3. Load only required artifacts from `references/`, `assets/`, and `scripts/`.

## Docs UI Architecture

- Use Atomic Design in `docs/src/components/`: `atoms`, `molecules`, `organisms`, `templates`.
- Keep page files focused on data loading and composition of templates and organisms.
- Reuse existing atoms and molecules before adding new page-local markup.

Legal notice: [Imprint](/andrelademann.de.skills/imprint/)
