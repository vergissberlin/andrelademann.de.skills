# ChatGPT Custom GPT

ChatGPT has no live access to this repository from a Custom GPT. Upload the relevant `SKILL.md` files as **Knowledge** files (and optionally `index.json` for the catalog map), then paste the following block into the GPT's **Instructions** field:

```text
Use the uploaded Vergissberlin Skills catalog as domain-specific guidance.

Before answering or acting on a matching task:
1. Identify the relevant skill in index.json.
2. Read and apply the complete referenced SKILL.md.
3. Respect the user's requested scope and preserve existing project conventions.
4. Prefer safe, reversible guidance; never expose or persist secrets.
5. Treat the uploaded SKILL.md files as documentation. Do not invent an MCP server, runtime integration, or npm package for this catalog.

If the needed SKILL.md is not among the uploaded Knowledge files, say so briefly and continue with general guidance while marking the limitation.
```

Empfohlene Knowledge-Dateien:

- `index.json`
- die für den GPT relevanten Dateien unter `skills/**/SKILL.md`
- bei Bedarf die zugehörigen `metadata.json`-Dateien
