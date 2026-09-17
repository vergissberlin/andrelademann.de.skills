---
name: andrelademann-skill-creator
description: Create, refine, test, document, and register skills in the André Lademann Skills repository. Use whenever a user asks to create a skill, turn a workflow into a reusable skill, improve an existing SKILL.md, add skill tests, create a skill README, or extend this catalog with a new skill.
version: 2.6.0 # x-release-please-version
scope: meta
---

# Skill Creator

This skill belongs to the [André Lademann Skills](https://github.com/vergissberlin/andrelademann.de.skills) catalog. Invoke it as `andrelademann-skill-creator`.

Create repository-native skills using the Anthropic Skill Creator method as the design baseline, then apply this repository's catalog, documentation, and test contract. The result is a usable skill, not just a draft prompt.

## Start with intent

Read `AGENTS.md`, `CONTRIBUTING.md`, `index.json`, the closest existing skill, and [references/repository-contract.md](references/repository-contract.md). Extract from the request or ask only for material gaps:

- what the skill enables and which requests should trigger it
- expected inputs, outputs, tools, dependencies, and edge cases
- the target domain and final kebab-case skill name
- two or three realistic test prompts and objective success criteria

For a small, well-specified request, infer minor details and continue. Ask before writing when a missing choice would change the scope or introduce a destructive action.

## Draft the skill

Follow the official Anthropic loop: capture intent, write a lean draft, create evaluations, run them, review the result, and iterate. Read [references/anthropic-method.md](references/anthropic-method.md) for the source mapping; do not copy the upstream skill wholesale.

Write the skill in imperative language and keep the trigger description discriminating but explicit. Put only reusable decision guidance in `SKILL.md`; move conditional detail to `references/`, deterministic transformations to `scripts/`, and generated-output resources to `assets/`. Keep `SKILL.md` below 500 lines where possible.

Do not invent credentials, private facts, APIs, or a runtime dependency. Never add instructions for malware, unauthorized access, data exfiltration, or other surprising behavior. Preserve user-supplied names, formats, and constraints.

## Create and register it

Use the bundled generator for the repository mutation:

```bash
node skills/meta/andrelademann-skill-creator/scripts/create-skill.mjs \
  --name <skill-name> \
  --domain <domain> \
  --title "<display title>" \
  --description "<trigger-aware description>" \
  --purpose "Use when ..." \
  --tags "tag-one,tag-two" \
  --body-file /path/to/final-body.md \
  --test-prompt "<realistic primary request>" \
  --test-prompt "<realistic edge-case request>"
```

The generator refuses accidental overwrites and creates the nested skill directory, `SKILL.md`, `metadata.json`, a README from [templates/skill-readme.md](../../../templates/skill-readme.md), Anthropic-compatible `evals/evals.json`, and the repository harness files under `tests/scenarios/<skill-name>/`. It also synchronizes `index.json` and `docs/index.json`, registers version-bearing files for Release Please, updates the copy-ready integration lists, and generates the skill OG preview when the docs dependencies are available.

If the user explicitly authorizes replacing an existing skill, pass `--force` and preserve unrelated files. Do not use `--force` as a convenience.

## Write useful tests

Make each test prompt look like a real user request, not a heading or keyword check. Cover the primary workflow and one meaningful boundary or failure case. Put objective checks in `acceptance-criteria.md`; use forbidden patterns for unsafe or out-of-scope behavior and keep subjective quality judgments for human review.

The local harness is the repository's visible test surface. Run it in mock mode first for deterministic feedback:

```bash
cd tests
pnpm check:metadata
pnpm typecheck
pnpm test:run
pnpm harness --skill <skill-name> --mock --verbose
```

The docs skill detail page reads the harness snapshot and shows pass/fail status when the Pages workflow generates `docs/src/data/harness-results.json`. Do not claim that a real Copilot evaluation passed when only mock mode ran.

## Verify the complete change

Check that the new catalog entry points to the real nested `SKILL.md`, both catalog files are byte-identical, metadata and skill versions match the catalog version, the README template placeholders are gone, the OG file exists, and the marketplace JSON remains valid. Run `git diff --check`, the metadata/unit/harness checks, and the docs check/build when dependencies permit.

Finish with the created paths, test commands and results, any checks that could not run, and the Conventional Commit message used for the change.
