# André Lademann Skills catalog

Use this repository's Skills catalog as additional context for domain-specific work. The catalog index is `index.json`; each entry points to the authoritative `SKILL.md` under `skills/`.

Before starting work in a matching domain:

1. Read `index.json` and identify the relevant skill.
2. Read the complete referenced `SKILL.md` before applying its workflow.
3. Follow `AGENTS.md` and the repository's existing conventions.
4. Keep changes scoped, avoid destructive defaults, and never expose or persist secrets.
5. Do not invent a runtime integration, MCP server, or package for this catalog: these files are documentation/configuration templates only.

Available catalog skills:

- `andrelademann-blog-header-image` → `skills/blog/andrelademann-blog-header-image/SKILL.md`
- `andrelademann-blog-post-writer-guided` → `skills/blog/andrelademann-blog-post-writer-guided/SKILL.md`
- `andrelademann-blog-post-writer` → `skills/blog/andrelademann-blog-post-writer/SKILL.md`

When adding or changing a skill, keep `index.json`, `docs/index.json`, metadata, the AGENTS.md generator, `.claude-plugin/marketplace.json`, and the integration examples consistent.
