# Acceptance criteria for andrelademann-skill-creator

The skill must create a complete repository-native skill package and leave the catalog in a valid, synchronized state.

## Repository integration

### ✅ Correct

```python
catalog_updated = True
tests_created = True
readme_created = True
verification_complete = True
```

### ❌ Incorrect

No generated result may claim completion while omitting the catalog, tests, README, or verification step.
