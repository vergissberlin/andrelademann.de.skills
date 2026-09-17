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
docs/src/data/harness-results.json
```

`index.json` and `docs/index.json` must be byte-identical. The catalog entry's `name`, directory name, frontmatter `name`, and `SKILL.md` path must agree. `metadata.json` needs `title`, `author`, `description`, `purpose`, `tags`, `source`, and `version`; its version and the frontmatter version must match `index.json`.

Keep `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and the integration templates valid and aligned with the root catalog. Register new version-bearing files in `release-please-config.json`. The root Claude marketplace points at `./`, so a catalog entry automatically makes the skill available through the root plugin; do not invent a duplicate plugin entry.

Use these checks from the repository root:

```bash
cmp -s index.json docs/index.json
cd tests && pnpm check:metadata && pnpm typecheck && pnpm test:run
cd ../docs && pnpm check && pnpm build
```

The docs build consumes the copied `docs/skills` tree and the checked-in mock baseline at `docs/src/data/harness-results.json`; CI refreshes that snapshot before deployment. Keep it synchronized with the catalog so a local detail page never falls back to a missing snapshot.
