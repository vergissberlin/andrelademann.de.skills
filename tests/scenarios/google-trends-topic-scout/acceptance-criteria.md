# Acceptance criteria for google-trends-topic-scout

The skill must return a source-backed editorial shortlist, distinguish relative trend signals from facts, and stop before writing an article.

## Research evidence

### ✅ Correct

```python
geography = "DE"
retrieval_context_recorded = True
trends_values_relative = True
corroborated = True
```

### ❌ Incorrect

```python
absolute_search_volume = 100000
```

## Editorial boundary

### ✅ Correct

```python
full_article_written = False
ranked_shortlist_only = True
```

### ❌ Incorrect

```python
full_article_written = True
```

## Signal confidence

### ✅ Correct

```python
short_window_classification = "short-lived hook"
long_window_compared = True
```

### ❌ Incorrect

```python
durable_signal = True
long_window_compared = False
```
