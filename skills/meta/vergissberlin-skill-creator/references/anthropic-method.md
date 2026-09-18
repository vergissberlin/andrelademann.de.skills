# Anthropic Skill Creator method

This repository skill is based on the public Anthropic `skill-creator` workflow:

- [Official `SKILL.md`](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Anthropic Skills repository](https://github.com/anthropics/skills)

## Adaptation map

| Anthropic phase | Repository implementation |
| --- | --- |
| Capture intent and research | Read the repo contract, closest skills, and the user's concrete workflow. Verify external technical facts from primary sources when needed. |
| Write a draft | Author a focused `SKILL.md` with progressive disclosure and a trigger-aware description. |
| Create eval prompts | Store prompts in `evals/evals.json` and mirror them in `tests/scenarios/<skill>/scenarios.yaml`. |
| Add quantitative checks | Put objective positive/negative examples in `acceptance-criteria.md`; run the local mock harness. |
| Review and iterate | Inspect harness output, run the docs check/build, and revise only issues supported by evidence. |
| Optimize triggering | Improve the frontmatter description with realistic positive and near-miss negative prompts; do not keyword-stuff it. |

The upstream workflow's optional browser viewer and real-agent comparison are not silently simulated here. Use the repository harness and report whether evaluation was mock or real.
