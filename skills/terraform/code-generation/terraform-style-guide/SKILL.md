---
name: terraform-style-guide
description: Generate and review Terraform code using HashiCorp style conventions, structure, and security defaults.
version: 1.0.0
scope: terraform-code-generation
---

# Terraform Style Guide

Use this skill when writing or reviewing Terraform HCL to keep formatting, naming, and file structure consistent.

## When to Use

- New Terraform modules or stacks
- PR reviews for Terraform style and maintainability
- Refactors that change file structure and naming

## Core Rules

1. Keep module files predictable (`terraform.tf`, `providers.tf`, `main.tf`, `variables.tf`, `outputs.tf`, `locals.tf`).
2. Use lowercase snake_case for identifiers.
3. Add `description` and `type` for every variable.
4. Add `description` for every output and mark sensitive outputs.
5. Prefer `for_each` over `count` for non-boolean fan-out.
6. Do not hardcode secrets; prefer variables and secure secret delivery.
7. Run `terraform fmt -recursive` and `terraform validate`.

## Security Defaults

- Encryption at rest when available
- Private networking defaults
- Least-privilege network and IAM policies
- Logging/monitoring enabled where possible

## Reference

- https://developer.hashicorp.com/terraform/language/style
- Source adapted from HashiCorp skill: https://raw.githubusercontent.com/hashicorp/agent-skills/main/terraform/code-generation/skills/terraform-style-guide/SKILL.md
