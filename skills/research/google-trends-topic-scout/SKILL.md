---
name: google-trends-topic-scout
description: "Find and rank source-backed Google Trends topics for André's editorial themes. Use when researching timely blog angles. Don't use for writing articles, generic keyword research, or social promotion."
license: MIT
metadata:
  version: 2.6.1 # x-release-please-version
  author: "André Lademann"
  scope: research
---

# Google Trends Topic Scout

Find timely topics that are genuinely useful for André's readers, not merely popular. Return a short, ranked editorial shortlist and stop there unless the user separately asks for an article or content package.

This skill is part of the André Lademann Skills catalog. Invoke it as `andrelademann-google-trends-topic-scout`.

## When to Use

Use this skill when the user needs timely, source-backed editorial topics; do not use it for article drafting or generic keyword research.

## Instructions

Follow the research contract, ranking rules, acceptance criteria, and edge-case handling below in order.

## Prerequisites and safety

- Require a selected geography, time window, retrieval date, and browser access before collecting signals; use the default profile only when the user gives no overrides.
- Check the live Google Trends result and corroborate promising candidates with an authoritative source before ranking them.
- Never invent trend scores, absolute search volume, sources, or confidence. If Trends or corroboration fails, report the error, label the fallback, and exclude unsupported claims.
- Validate that the result remains a shortlist; do not turn research into an article without a separate request.
- Use a dry-run research pass and confirm the shortlist before any downstream writing task; this scout creates no article files.

## Default profile

Use this profile when the user does not provide another one. Treat it as a relevance filter, not as a reason to force every trend into a post.

- **Primary:** cloud and platform architecture, Azure in practical operation, software engineering, AI/agent tooling, MCP and developer tools, developer experience, automation, and engineering careers.
- **Secondary:** open source, cloud governance and security, IoT/embedded systems, smart home, sustainability, and engineering culture.
- **Occasional niche:** Peugeot 304/classic-car restoration when a trend has a real technical, cultural, or restoration angle.

AWS may be included when it is relevant, but do not imply deep AWS experience. Use current conversation context and an explicitly supplied audience, geography, language, or theme list as overrides.

## Research contract

1. Set the search context before collecting ideas. Default to Germany (`DE`), German and English queries, and the current date in `Europe/Berlin`. If the user gives a country, market, audience, or time window, use that instead.
2. Use Google Trends as the primary live signal:
   - Check **Trending now** for the selected geography and a recent window such as 24 hours or 7 days.
   - Check **Explore** for seed terms from the relevant profile areas, using a broader window such as 90 days or 12 months to find rising and breakout related queries.
   - Compare short- and long-window signals. A term visible only in a short window is a potential news hook, not automatically a durable topic.
3. Open the underlying Google Trends result and record the exact query, geography, time range, retrieval date, and signal label (`active`, `rising`, or `breakout`) when available. Google Trends values are relative signals; never present them as absolute search volume.
4. Corroborate promising candidates with one or more authoritative or primary sources, such as a vendor announcement, standards body, project release, research paper, official incident report, or reputable reporting. Trends shows interest, not truth or importance.
5. Score each candidate on four questions: fit with the profile, usefulness to the intended reader, strength of a distinctive first-person or engineering angle, and evidence quality. Penalise celebrity/sports noise, generic product hype, SEO-only keywords, duplicate angles, and topics with no credible source.

If Google Trends is unavailable or its live result cannot be read, say so explicitly. A Google News or general web-search result may be used only as a clearly labelled fallback; never describe it as a Google Trends result and never invent a trend score.

## Ranking and output

Return five to ten candidates when the evidence supports that many. Lead with a one-sentence search summary, then use a compact table with:

| Rank | Topic/query | Trend signal and window | Why it fits | Strong editorial angle | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- | --- |

Keep the angle concrete: describe the reader problem, decision, implementation lesson, or tension the topic could support. For the top three, add a possible working title, a one-sentence thesis, and the next verification step. Mark each item as `short-lived hook`, `developing`, or `durable signal` based on the time-window comparison.

Include links close to the claims they support. Separate observed facts from editorial inference, and mention meaningful uncertainty or freshness risk. If fewer than five candidates are genuinely relevant, return fewer and explain the quality threshold briefly.

Do not write a full post, create files, publish anything, or schedule follow-up work unless the user explicitly asks for that next step.

## Acceptance Criteria

- Expected output is a ranked shortlist with the exact query, geography, time window, retrieval date, signal label, corroborating source, editorial angle, and confidence.
- Verify every candidate has a primary trend observation and an authoritative source; mark inference separately from observed facts.
- Example result:

```yaml
query: "example term"
geography: DE
signal: developing
source_verified: true
article_written: false
```

## Edge Cases

- Treat a short-window spike without a supporting long-window signal as a short-lived hook, not a durable topic.
- If Google Trends is unavailable, report the limitation and label any fallback as fallback research; never invent a trend score.
