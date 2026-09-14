# André Lademann — brand fonts

The docs site loads **Hanken Grotesk** and **Source Sans 3** from [Google Fonts](https://fonts.google.com/) (SIL OFL 1.1). See `docs/src/layouts/BaseLayout.astro` and `docs/src/styles/tailwind.css`.

## Self-hosting layout (optional)

When replacing the CDN with local files, use this layout:

```text
<family>/
  <weight>/
    regular.woff2
    italic.woff2   # omit if unused
```

Examples:

- `hanken-grotesk/400/regular.woff2`
- `hanken-grotesk/700/regular.woff2`
- `source-sans-3/400/regular.woff2`
- `source-sans-3/400/italic.woff2`

Point `@font-face` rules (or your bundler) at these paths, then remove the Google Fonts `<link>` from the layout.
