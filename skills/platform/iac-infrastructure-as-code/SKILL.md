---
name: iac-infrastructure-as-code
description: Use this skill for Terraform/Pulumi/CloudFormation changes when infrastructure risk, drift, security, or cost impact must be assessed.
version: 1.0.0
scope: infrastructure-as-code
allowed-tools:
  - read-config
  - static-analysis
  - plan-diff
  - cost-estimation
safe-defaults:
  - no-destructive-apply
  - propose-before-change
---

# IaC Infrastructure as Code Review

## When to Use?

- Pull Requests mit IaC-Dateien
- Änderungen an Netzwerk, IAM, Datenbanken, Stateful Services
- Verdacht auf Security- oder Kostenregression

## Process

1. **Kontext sammeln**: betroffene Umgebung, State-Backend, kritische Ressourcen
2. **Diff klassifizieren**: create/update/delete, blast radius, kritische Pfade
3. **Risiken bewerten**: IAM Over-Permissioning, öffentliche Endpunkte, unverschlüsselte Storage- oder DB-Konfigurationen
4. **Kostenabschätzung**: neue teure Ressourcen, Autoscaling-Änderungen, Datenabfluss
5. **Empfehlungen liefern**: priorisiert nach Risiko und Umsetzungsaufwand

## Edge Cases

- Fehlender State-Zugriff: nur statische Analyse, Annahmen explizit dokumentieren
- Multi-Cloud Repo: cloud-spezifische Findings markieren, generische Empfehlung bevorzugen
- `for_each`/`count` Änderungen: potenzielle Massendeployments besonders hervorheben

## Example Input

> "Bitte prüfe dieses Terraform-Diff für unser Prod-VPC- und IAM-Modul auf Security- und Kostenrisiken."

## Example Output

- Risiko: `high` – `0.0.0.0/0` auf Admin-Port (**Deployment blockieren bis behoben**)
- Risiko: `medium` – IAM wildcard action in deployment role
- Kosten: erwarteter Monatsanstieg durch neue NAT Gateways
- Empfehlung: Security Group einschränken, IAM policy härten, NAT architektur prüfen
