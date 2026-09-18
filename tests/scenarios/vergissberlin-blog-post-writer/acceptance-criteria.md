# Acceptance criteria for vergissberlin-blog-post-writer

The skill must create a complete draft package and delegate image work to its required companion skill.

## Article package

### ✅ Correct

```python
draft = True
heroImage = "/images/posts/2026/example/hero.png"
ogImage = "/images/posts/2026/example/hero.png"
companion_skill_used = True
```

### ❌ Incorrect

```python
draft = False
```

## Image replacement safety

### ✅ Correct

```python
existing_image_preserved = True
replacement_authorized = False
```

### ❌ Incorrect

```python
existing_image_preserved = False
replacement_authorized = False
```
