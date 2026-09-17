---
name: andrelademann-blog-header-image
description: "Generate and integrate photorealistic blog header images. Use when creating or replacing a post hero or social image. Don't use for article writing, social promotion, or generic image generation."
license: MIT
metadata:
  version: 2.6.1 # x-release-please-version
  author: "André Lademann"
  scope: blog
---

# Blog Header Image

This skill belongs to the [André Lademann Skills](https://github.com/vergissberlin/andrelademann.de.skills) catalog. Invoke it as `andrelademann-blog-header-image`.

Generate the actual header image for a blog post, not merely a prompt. This skill creates the single visual used as both the post's `heroImage` and `ogImage` on [blog.andrelademann.de](https://blog.andrelademann.de/).

## When to Use

Use this skill when a blog post needs a new or replacement hero image and the image-generation task is in scope.

## Instructions

Follow the visual brief, reference-image, generation, integration, safety, and acceptance-criteria sections in order.

## Prerequisites and safety

- Require the complete post, its frontmatter, and the image-generation capability before starting.
- Check the destination path and existing `hero.png` before writing. Never overwrite an existing asset without explicit replacement authority.
- Use a dry-run path check or a backup before any authorized replacement.
- If a reference, generation, path, or content check fails, stop, report the error, and preserve the current asset. Do not claim completion until validation passes.

## Establish the visual brief

- Read the complete target post and its frontmatter before generating anything.
- Build the image around the article's central claim, not just its broad category. A post about an AI usage habit, for example, needs a meaningful human or workspace moment rather than a stock robot.
- Respect user-supplied visual direction. If no direction is given, make a tasteful choice that serves the article without adding invented products, companies, events, or claims.

## André Lademann reference images

- `assets/andre-lademann-reference/portrait.png` is the image-generation-ready primary identity reference for André; `portrait.heic` preserves the original source photo.
- `assets/andre-lademann-reference/workspace.png` is a supporting reference for his appearance and working environment.
- `assets/andre-lademann-reference/stickered-laptop-back.jpg` preserves the original photo of André's personal sticker-covered laptop; the matching `.png` is the image-generation-ready version. Use it when a blog image should include his laptop; preserve the distinctive lived-in sticker collage without reproducing readable third-party text or logos unless explicitly requested.
- When the user asks to show André, inspect the relevant references and provide them to the image-generation flow as identity references. Preserve his recognisable appearance without copying the reference scene, outfit, or screen content unless requested.
- These files are private skill assets. Keep them outside `public/` and do not link them from a post.

## Generate with Codex or ChatGPT

- In Codex or ChatGPT, use the built-in image-generation capability directly. Do not stop at an `image-prompt` or ask the user to generate the image elsewhere.
- Generate a landscape, photorealistic editorial photograph with real lighting, materials, environment details, lens and depth-of-field direction.
- Make the scene suitable for a personal engineering blog: intelligent and specific, never a generic glossy stock-tech composition.
- Do not include headlines, labels, logos, watermarks, pseudo-interface text, illustration styling, vector aesthetics, or 3D-render aesthetics unless the user explicitly requests them.
- Inspect the generated result. Correct a concrete issue with one targeted iteration before selecting the final asset.

## Integrate safely

1. Derive `{year}` from the post's `pubDatetime` and save the selected image as `public/images/posts/{year}/{slug}/hero.png`.
2. Do not overwrite an existing `hero.png`; use a versioned sibling or ask for replacement authority.
3. Set both fields to the public path:

```yaml
heroImage: "/images/posts/{year}/{slug}/hero.png"
ogImage: "/images/posts/{year}/{slug}/hero.png"
```

4. Verify that the file exists, the frontmatter path resolves under `public/`, and the article still passes the repository's content checks.

## Acceptance criteria

- Expected output includes one existing image path used identically for both `heroImage` and `ogImage`.
- Verify the asset exists, the frontmatter resolves to it, and the content checks pass before reporting success.
- Handle edge cases such as an existing image, missing references, generation failure, or an invalid destination by preserving the current asset and reporting the error.

Report the final asset path, the prompt used, and that direct image generation was used.
