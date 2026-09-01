# Skill Evaluation Harness

This directory contains the Microsoft-style skill evaluation harness used to test `tp-skills`.

## Attribution

Parts of this harness are based on the MIT-licensed implementation from the Microsoft `skills` repository:

- https://github.com/microsoft/skills/tree/main/tests

The local copy is adapted for the André Lademann repository layout:

- skills are loaded from `skills/<skill>/SKILL.md` (instead of `.github/skills/<skill>/SKILL.md`)
- repository root detection uses `skills/` and `index.json`
- scenarios and acceptance criteria live in `tests/scenarios/<skill>/`

## Quick Start

```bash
cd tests
pnpm install
pnpm typecheck
pnpm test:run
pnpm harness --all --mock
```

## Real Copilot Evaluation (Optional)

For non-mock evaluation, provide a token with Copilot Requests permission:

```bash
export GH_TOKEN="your-token"
cd tests
pnpm harness --all --verbose
```

For GitHub Actions real evaluation:

- set repository variable `ENABLE_REAL_EVAL=true`
- add repository secret `COPILOT_TOKEN` with Copilot Requests permission
