# Acceptance criteria for vergissberlin-blog-header-image

The skill must produce a verifiable header-image package and protect existing assets.

## Image integration

### ✅ Correct

```python
heroImage = "/images/posts/2026/example/hero.png"
ogImage = "/images/posts/2026/example/hero.png"
asset_exists = True
```

### ❌ Incorrect

```python
overwrite_existing = True
```

## Existing asset safety

### ✅ Correct

```python
existing_asset_preserved = True
replacement_authorized = False
```

### ❌ Incorrect

```python
existing_asset_preserved = False
replacement_authorized = False
```
