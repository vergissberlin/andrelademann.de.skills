---
name: andrelademann-blog-post-writer-guided
description: Lead André Lademann through choosing and creating a complete post with a generated header image for blog.andrelademann.de. Use for guided writing or when the topic, audience, tags, or length remain open.
version: 1.0.1
---

# André Lademann Blog Post Writer Guided

Guide André through a focused editorial brief, then create the finished article and its header image for [blog.andrelademann.de](https://blog.andrelademann.de/). This is for his personal engineering blog, not generic SEO copy.

## Gather only the missing editorial choices

Read `AGENTS.md`, `README.md`, and existing post frontmatter before asking questions. Collect related answers together when the interface permits.

1. **Topic and angle**: If no topic is provided, research current angles that suit André's blog: cloud architecture, software engineering, AI and agents, developer tooling, security, careers, or a personal reflection grounded in engineering life. If the topic exists but the point is vague, ask what readers should take away.
2. **Audience**: Developers, architects or tech leads, decision makers, or a mixed audience.
3. **Length**: short personal reflection (300–500 words), medium explainer (700–1,000 words), or long technical tutorial (1,200–1,800 words).
4. **Tags**: Offer relevant existing tags before creating a new one.
5. **Language**: English only (default), German only, or both. If both, the two files are true translations of the same argument, not independent drafts.

Do not draft until the open choices are confirmed. Never present a current headline, statistic, product detail, or quotation as stable without verification.

## Adapt the piece

- **Developers**: open with a real implementation problem and use compact, runnable examples when they help.
- **Architects and tech leads**: centre the decision and its trade-offs. Use a Mermaid diagram only when it makes the system easier to understand.
- **Decision makers**: lead with impact and risk. Do not invent numerical benefits; explain technical language plainly.
- **Mixed audience**: balance context and depth, with at most one well-explained technical example.

Write according to `andrelademann-blog-post-writer`: British English (or, for a German edition, natural German in André's voice — never a literal machine translation), personal and active prose, meaningful headings, no emoji or emoticons, and typographic ellipses in prose. See that skill's **Language and translations** section for the `locale` / `translationKey` mechanics when producing both editions.

## Complete the visual package

`andrelademann-blog-header-image` is a required companion skill for this workflow. Activate it and follow its complete instructions once the article is drafted; referencing it or reproducing only part of its guidance is not sufficient. Generate the header image in the same task unless the user supplies an image, explicitly opts out, or explicitly requests a separate visual task.

Derive the visual from the selected angle and completed draft; do not ask a separate visual-direction question unless the user has stated a specific visual preference. A German edition reuses the same `heroImage`/`ogImage` asset as its English pair — never generate a second image for a translation.

Save the post under `src/content/posts/{slug}.md` or `.mdx`, use valid frontmatter with `draft: true` unless explicitly told otherwise, and set both `heroImage` and `ogImage` to the generated header asset.

Report the article path(s), header-image path, audience mode, word count, tags, sources, and material assumptions.
