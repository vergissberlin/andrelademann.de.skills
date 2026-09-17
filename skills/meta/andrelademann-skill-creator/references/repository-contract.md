# Repository contract

New skills belong under a domain directory:

```text
skills/<domain>/<skill-name>/
├── SKILL.md
├── metadata.json
├── README.md
└── evals/evals.json
```

The registry and visible test surfaces are:

```text
index.json
docs/index.json
tests/scenarios/<skill-name>/scenarios.yaml
tests/scenarios/<skill-name>/acceptance-criteria.md
docs/public/og/skills/<skill-name>.png
```

`index.json` and `docs/index.json` must be byte-identical. The catalog entry's `name`, directory name, frontmatter `name`, and `SKILL.md` path must agree. `metadata.json` needs `title`, `author`, `description`, `purpose`, `tags`, `source`, and `version`; its version and the frontmatter version must match `index.json`.

Keep `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and the integration templates valid and aligned with the root catalog. Register new version-bearing files in `release-please-config.json`. The root Claude marketplace points at `./`, so a catalog entry automatically makes the skill available through the root plugin; do not invent a duplicate plugin entry.

Use these checks from the repository root:

```bash
cmp -s index.json docs/index.json
cd tests && pnpm check:metadata && pnpm typecheck && pnpm test:run
cd ../docs && pnpm check && pnpm build
```

The docs build consumes the copied `docs/skills` tree and harness snapshot produced by CI. A local detail page can therefore show test status only after that preparation step has run.
