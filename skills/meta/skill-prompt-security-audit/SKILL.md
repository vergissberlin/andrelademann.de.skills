---
name: skill-prompt-security-audit
description: Audit collections of SKILL.md files for adversarial prompt patterns, unsafe credential and shell instructions, and ambiguous wording. Classify false positives and report path-level findings.
version: 1.0.0
scope: skill-authoring
allowed-tools:
  - repository-read
  - pattern-search
  - static-text-review
safe-defaults:
  - read-only-audit
  - no-secret-echo
  - path-citations
---

# Skill Prompt Security Audit

## When to Use

- You want to review a skill catalog for security-critical prompt text.
- You are importing third-party skills and need a fast trust check.
- You are preparing a release and want to catch risky prompt wording early.

## Process

1. Build the inventory of skill files using `**/SKILL.md`.
2. Mark mirrored or duplicated documentation paths (for example `docs/skills/`) so findings are not double-counted.
3. Scan for prompt-injection and jailbreak patterns that try to override higher-priority instructions.
4. Scan for secret and exfiltration prompts, such as instructions to expose credentials, commit `.env`, or copy connection strings into reports.
5. Scan for destructive or privileged execution language and classify whether the wording is unsafe or purely contextual.
6. Review `safe-defaults` and guardrail language for missing or contradictory safety guidance.
7. Classify each match as `malicious_instruction`, `defensive_security`, or `false_positive` with a short rationale.
8. Produce a final report with file path, severity, evidence snippet, and recommended remediation.

## Findings Taxonomy

- `malicious_instruction`: Explicit bypass, exfiltration, or unsafe execution prompt.
- `defensive_security`: Safety guidance such as "do not hardcode secrets".
- `false_positive`: Benign terms with overloaded vocabulary, for example design tokens.

## Common False Positives

- `token` used for UI design tokens rather than credentials.
- `destructive` used for component color semantics.
- Risk examples documented as warnings in review-style skills.

## Example Input

> "Scan all skills for security-critical prompts and summarize high-risk findings."

## Example Output

- Result: no malicious instructions found in 27 skill files.
- Defensive patterns found in Terraform, IaC, and AI guardrail skills.
- False positives identified for design-token vocabulary.
