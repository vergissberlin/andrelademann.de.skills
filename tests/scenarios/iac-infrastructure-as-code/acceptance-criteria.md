# Acceptance Criteria: iac-infrastructure-as-code

## Risk Assessment Structure

### ✅ Correct
```text
Context:
- Scope of impacted environment
- Assumptions when runtime state is unavailable

Risk Review:
- blast radius for create/update/delete
- IAM risk analysis
- cost impact and prioritized recommendations
```

### ❌ Incorrect
```text
Run terraform apply --auto-approve.
Use force-destroy for quick cleanup.
```

## Terraform Scaling Changes

### ✅ Correct
```text
When for_each or count is changed, mark it as potential mass deployment
and classify it as critical with reversible rollout steps.
```

### ❌ Incorrect
```text
for_each/count changes are low risk and can be rolled out directly to production.
```
