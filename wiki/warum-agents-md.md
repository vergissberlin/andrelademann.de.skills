# Warum es eine AGENTS.md gibt

Die `AGENTS.md` definiert agentenspezifische Leitplanken für das Repository.

## Zweck

- Rollen, Grenzen und Erwartungen für Agents festhalten.
- Einheitliches Verhalten bei Analyse, Änderungen und Validierung sicherstellen.
- Sicherheits- und Qualitätsanforderungen zentral dokumentieren.

## Vorteil

Mit `AGENTS.md` werden Ergebnisse nachvollziehbarer, konsistenter und sicherer.

## Orientierung an etablierten Best Practices

Wir orientieren uns inhaltlich an den Leitlinien aus dem Anthropic-Artikel
["Using CLAUDE.md files: Customizing Claude Code for your codebase"](https://claude.com/blog/using-claude-md-files).

Auch wenn der Artikel `CLAUDE.md` für Claude Code beschreibt, ist das Grundprinzip für `AGENTS.md` identisch:
persistenter, projektspezifischer Kontext, der nicht in jeder Session neu erklärt werden muss.

### Kurz-Checkliste für eine gute AGENTS.md

- Halte den Zweck des Repositories in 1-2 Sätzen fest.
- Gib eine klare Projekt-Karte (wichtige Verzeichnisse und Verantwortlichkeiten).
- Dokumentiere ausführbare Standard-Commands (z. B. `pnpm lint`, `pnpm test`, `pnpm build`).
- Beschreibe relevante Tool- und MCP-Workflows nur dort, wo sie echten Mehrwert liefern.
- Definiere den gewünschten Arbeitsablauf vor Codeänderungen (analysieren, planen, umsetzen, validieren).
- Lege Security-Regeln fest: keine Secrets, Keys oder Connection Strings in `AGENTS.md`.
- Halte die Datei kompakt und entwickle sie iterativ entlang echter Reibungspunkte.

## Abgleich mit diesem Repository

- Stark abgedeckt: Prinzipien, Sicherheitsleitplanken und repo-spezifische Regeln sind klar dokumentiert.
- Stark abgedeckt: Skills-, Struktur- und Dokumentationskonventionen sind konkret beschrieben.
- Optional ausbaubar: Ein expliziter Abschnitt mit häufigen Standard-Commands könnte Onboarding beschleunigen.
- Optional ausbaubar: Eine kompakte MCP-/Tool-Sektion kann sinnvoll sein, wenn feste Team-Workflows bestehen.

> Hinweis: Im Docs-Bereich ergänzt die Seite `docs/src/pages/agent-md-generator.astro`
> diese Leitlinien bereits um praktische "Must have / Should have / Avoid"-Empfehlungen.

## Claude-Code-spezifische Hinweise

Der verlinkte Artikel enthält zusätzliche Features, die primär Claude Code betreffen, z. B. `/init`,
`/clear`, Subagents und Custom Slash Commands unter `.claude/commands/`.
Diese Punkte sind als ergänzender Kontext hilfreich, aber nicht automatisch Pflichtvorgaben für Cursor-Workflows.
