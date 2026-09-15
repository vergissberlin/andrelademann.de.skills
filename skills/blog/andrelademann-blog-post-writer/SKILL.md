---
name: andrelademann-blog-post-writer
description: Plan and create a complete post with a generated header image for André Lademann's blog at blog.andrelademann.de. Use for guided writing when editorial choices remain open, or for direct article creation when the topic and audience are already clear.
version: 2.5.1 # x-release-please-version
scope: blog
---

# Blog Post Writer

This skill belongs to the [André Lademann Skills](https://github.com/vergissberlin/andrelademann.de.skills) catalog. Invoke it as `andrelademann-blog-post-writer`.

Create a complete Markdown or MDX article and its finished visual package for André Lademann's personal blog, [blog.andrelademann.de](https://blog.andrelademann.de/). The blog covers cloud architecture, software development, AI and agent tooling, developer experience, careers, and personal engineering observations. It sounds like André sharing a considered opinion with fellow practitioners, never like corporate content marketing.

## Start from the repository, not generic assumptions

- Read `AGENTS.md`, the **Writing posts** section in `README.md`, and a few related posts in `src/content/posts/`.
- Reuse established tags where they fit. Read the latest posts for the current voice, not only older articles.
- Do not invent André's experiences, client stories, quotes, statistics, benchmarks, or product facts. Verify time-sensitive claims and place material research sources in `sources` frontmatter.

## Choose the workflow

Use the request to decide how much editorial guidance is needed:

- **Direct workflow**: When the topic, angle, and audience are clear, make reasonable, stated assumptions for minor details and continue without an interview.
- **Guided workflow**: When material choices remain open, gather only the missing choices below. Group related questions when the interface permits, and do not draft until the open choices are confirmed.

For the guided workflow, establish:

1. **Topic and angle**: If no topic is provided, research current angles that suit André's blog. If the topic is broad, ask what readers should take away.
2. **Audience**: Developers, architects or tech leads, decision makers, or a mixed audience.
3. **Length**: Short personal reflection (300–500 words), medium explainer (700–1,000 words), or long technical tutorial (1,200–1,800 words).
4. **Tags**: Offer relevant existing tags before creating a new one.
5. **Language**: English only by default, German only, or both. If both, create true translations of the same argument rather than independent drafts.

Never present a current headline, statistic, product detail, or quotation as stable without verification.

Adapt the article to the selected audience:

- For developers, open with a real implementation problem and use compact, runnable examples when helpful.
- For architects and tech leads, centre the decision and its trade-offs. Use a Mermaid diagram only when it improves understanding.
- For decision makers, lead with impact and risk, explain technical language plainly, and never invent numerical benefits.
- For a mixed audience, balance context and depth with at most one well-explained technical example.

## Write in André's voice

- Write post content in British English.
- Start with a recognisable problem, moment, or sharp opinion. Do not add an `Introduction` heading.
- Use active, direct prose. First person is welcome when it is truthful and helps make the argument personal.
- Use three to five descriptive H2 sections. Let prose lead; introduce lists, diagrams, and code only when they genuinely clarify the point.
- For technical articles, use small, language-labelled examples. A bad-versus-better comparison is useful when it exposes an actual trade-off.
- Close by moving the reader forward with a useful next step, question, or gentle invitation. Do not repeat the article as a conclusion.
- Do not use emoji or emoticons. Use the typographic ellipsis `…` in prose; retain `...` only where code syntax requires it.

## Create the post package

Save the article as `src/content/posts/{slug}.md` or `.mdx`. Use a concise kebab-case slug and valid post frontmatter:

```yaml
---
author: André Lademann
pubDatetime: 2026-09-09T09:00:00.000Z
title: "Concise, specific title"
slug: concise-kebab-case-slug
featured: false
draft: true
tags:
  - relevant-existing-tag
heroImage: "/images/posts/2026/concise-kebab-case-slug/hero.png"
ogImage: "/images/posts/2026/concise-kebab-case-slug/hero.png"
description: "A hook-style teaser that makes the reader want to continue."
canonicalURL: https://blog.andrelademann.de/concise-kebab-case-slug
---
```

- Set `pubDatetime` to the intended timestamp and derive the image folder year from it. Never leave the example date or slug in a saved article.
- Use two to four lowercase kebab-case tags. Keep `draft: true` unless the user explicitly asks otherwise.
- Use the same generated file for `heroImage` and `ogImage`. These power the post's header and social metadata as one coherent visual.

## Language and translations

The default language is British English, with `locale: en` in frontmatter. Only add a German edition when the user asks for one or confirms it in the guided workflow.

When a post has both an English and a German edition:

- Give each language its own file, its own kebab-case `slug` (German posts get a genuinely German slug, not a transliteration), and its own `locale` (`en` or `de`).
- Both files share one `translationKey` — reuse the English slug as the key, since it's already stable and unique. This is how the site pairs the two editions of the same article.
- The German edition is a fresh piece of writing in André's German voice (see `pair-programmierung.md`, `gilden-laufen-nicht-auf-goodwill.md`, or `gute-retrospektiven-fuhlen-sich-wie-pflicht-an.md` for tone), not a literal or mechanical translation of the English draft. Translate `title` and `description` accordingly, and use `du`-form direct address consistent with the rest of the German-language archive.
- Translate tags into their established German equivalents where the archive already has one (`ai` → `ki`, `learning` → `lernen`, `collaboration` → `zusammenarbeit`, `agile` → `agil`); coin a sensible new German tag, rather than reusing the English one, when no precedent exists yet.
- Both editions reuse the exact same `heroImage`/`ogImage` path — generate the header image once, not once per language.
- Keep `pubDatetime` identical (or intentionally offset if the user wants staggered publication) across the pair, and keep both at the same `draft` status unless told otherwise.

## Generate the header image directly

Every new post receives a header image in the same task unless the user supplies an asset, explicitly opts out, or asks to keep visual work separate.

`andrelademann-blog-header-image` is a required companion skill for this workflow. Activate it and follow its complete instructions while creating the post; referencing it or reproducing only part of its guidance is not sufficient.

1. Read the complete draft and choose one concrete visual metaphor or scene that represents its central argument. Never fall back to an unrelated generic laptop image or ask for separate visual direction unless the user has expressed a preference.
2. Invoke the activated `andrelademann-blog-header-image` skill. In Codex or ChatGPT, use the built-in image-generation capability directly; do not merely return an image prompt.
3. Save the approved result under `public/images/posts/{year}/{slug}/hero.png`, then update both image fields in the post's frontmatter.
4. Do not overwrite an existing header image unless the user explicitly asks for replacement.

## Finish well

Run the relevant content checks after saving. Report the post path, header-image path, audience mode, article type, approximate word count, applied tags, sources if used, and material assumptions. Do not call the post complete if its required generated header image is missing.
