# Contributing

Danke fürs Mitmachen. Dieses Dokument beschreibt Entwicklung, Build, neue Skills und Deployment. Agent-spezifische Guardrails stehen zentral in [`AGENTS.md`](AGENTS.md); sie werden hier nicht dupliziert.

## Projektstruktur

```text
.
├── docs/                    # Astro docs-site (Quellcode)
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   ├── astro.config.mjs
│   ├── package.json
│   └── tsconfig.json
├── integrations/            # Vorlagen für Cursor, Copilot, VS Code und ChatGPT
├── skills/                  # Skill-Definitionen (SKILL.md)
├── index.json               # Skill-Katalog-Metadaten
├── .github/workflows/pages.yml
├── templates/skill-readme.md  # README-Vorlage für generierte Skills
└── templates/basic-skill/
```

## Entwicklung

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
cp index.json docs/index.json
cd docs
pnpm install
pnpm dev
```

Die Katalogversion in `index.json` und die Version jedes Skills in `SKILL.md` sowie `metadata.json` entsprechen dem Release-Tag `X.Y.Z`. Neue Skills müssen mit beiden versionsführenden Dateien in `release-please-config.json` eingetragen werden, damit Release Please alle Versionsnummern gemeinsam aktualisiert. Installationsbefehle sollen auf diesen Tag zeigen, zum Beispiel `npx skills add vergissberlin/andrelademann.de.skills@2.0.0 --skill <skill-name>`.

## Build

```bash
cd docs
pnpm check
pnpm build
```

## Skills hinzufügen

1. Ordner unter einer Domäne anlegen, z. B. `skills/blog/<skill-name>/`
2. `SKILL.md` mit Frontmatter und kurzem Titel ohne `André Lademann`-Präfix erstellen
3. `metadata.json` mit `title`, `author`, `description`, `purpose`, `tags`, `source` und `version` ergänzen
4. `README.md` aus [`templates/skill-readme.md`](templates/skill-readme.md) ableiten
5. Harness-Fixtures unter `tests/scenarios/<skill-name>/` mit `scenarios.yaml` und `acceptance-criteria.md` ergänzen
6. Skill in `index.json` ergänzen
7. Open-Graph-Asset anlegen: `docs/public/og/skills/<skill-name>.png` (1200×630)
8. Sicherstellen, dass `docs/public/og/default.png` vorhanden ist (Fallback für Nicht-Skill-Seiten)

Für den vollständigen Ablauf bevorzugt [`create-skill.mjs`](skills/meta/andrelademann-skill-creator/scripts/create-skill.mjs) verwenden. Es erstellt aus Name, Domain, Beschreibung und Testprompts das Skill-Paket, README, Anthropic-kompatible Evals sowie `tests/scenarios/<skill-name>/`; anschließend synchronisiert es Katalog, Release-Please-Dateien, Integrationslisten und den OG-Preview.

## Integrationen pflegen

Beim Hinzufügen oder Ändern eines Skills müssen die Vorlagen unter [`integrations/`](integrations/) konsistent bleiben. Insbesondere die Beispiel-Skill-Liste in [`integrations/copilot/copilot-instructions.md`](integrations/copilot/copilot-instructions.md), [`.github/copilot-instructions.md`](.github/copilot-instructions.md) und [`integrations/cursor/skills.mdc`](integrations/cursor/skills.mdc) sowie die Einträge in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) prüfen und aktualisieren.

## Deployment

Die statische Docs-Site wird durch `.github/workflows/pages.yml` auf GitHub Pages veröffentlicht. Der Workflow läuft bei veröffentlichten GitHub Releases und kann zusätzlich manuell gestartet werden. Vor dem Build werden `index.json`, `skills/` und der Mock-Harness-Snapshot nach `docs/` kopiert.

Der Release-Please-Workflow verwendet den eingebauten `GITHUB_TOKEN`. Nach einer erfolgreichen Veröffentlichung ruft er die wiederverwendbaren Workflows für GitHub Pages und das Wiki direkt mit dem neuen Tag auf. Dadurch ist kein persönlicher Access Token nötig und beide Dokumentationsziele werden bei jedem Release aktualisiert.
