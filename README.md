# André Lademann Skills

Ein kompakter Skills-Katalog für AI-Coding-Agents – mit Claude-Code-Marketplace und copy-ready Integrationsvorlagen für ChatGPT, GitHub Copilot, Cursor und VS Code.

## Installation

### Claude Code / Claude Desktop

Marketplace hinzufügen und anschließend einzelne Plugins installieren:

```text
/plugin marketplace add vergissberlin/andrelademann.de.skills
/plugin install <name>@vergissberlin
```

Alternativ kann ein einzelner Skill über den generischen Installer bezogen werden:

```bash
npx skills add vergissberlin/andrelademann.de.skills@2.0.0 --skill <skill-name>
```

Die Marketplace-Einträge und Domain-Plugins liegen unter [`.claude-plugin/`](.claude-plugin/).

### Cursor

Die Vorlage nach `.cursor/rules/skills.mdc` kopieren:

```bash
mkdir -p .cursor/rules
cp integrations/cursor/skills.mdc .cursor/rules/skills.mdc
```

Details: [`integrations/cursor/skills.mdc`](integrations/cursor/skills.mdc).

### GitHub Copilot

Die repo-weite Vorlage liegt bereits als [`.github/copilot-instructions.md`](.github/copilot-instructions.md) bei. Für andere Repositories kann sie aus [`integrations/copilot/`](integrations/copilot/) kopiert werden. Sie funktioniert für Copilot Chat, Agent Mode und Copilot Coding Agent, sofern die jeweilige Umgebung Custom Instructions unterstützt.

### VS Code

VS Code mit GitHub Copilot nutzt dieselbe [`.github/copilot-instructions.md`](.github/copilot-instructions.md). Falls Copilot dort nicht aktiv ist, kann der Inhalt über das Workspace-Setting **Custom Instructions** hinterlegt werden. Anleitung: [`integrations/vscode/README.md`](integrations/vscode/README.md).

### ChatGPT

Für einen Custom GPT:

1. Einen Custom GPT erstellen.
2. Den Copy-Paste-Block aus [`integrations/chatgpt/custom-gpt-instructions.md`](integrations/chatgpt/custom-gpt-instructions.md) in **Instructions** einfügen.
3. `index.json` und die relevanten `SKILL.md`-Dateien als **Knowledge** hochladen.

ChatGPT hat im Custom GPT keinen Live-Repo-Zugriff; Knowledge-Upload ist daher der vorgesehene Weg.

### Tool-übergreifender Weg

Der vorhandene [AGENTS.md-Generator](https://vergissberlin.github.io/andrelademann.de.skills/agent-md-generator/) erstellt aus ausgewählten Domänen eine kompakte `AGENTS.md`. Viele Coding-Agents, darunter Copilot und Cursor, lesen diese Datei als Kontextquelle.

Alle Integrationsvorlagen sind unter [`integrations/`](integrations/) gesammelt. Sie sind Doku- und Config-Vorlagen, keine eigene Laufzeitkomponente.

## Skills

Die drei Blog-Skills stehen im Katalog [`index.json`](index.json). Die fachliche Quelle jedes Eintrags ist die verlinkte `SKILL.md`; zusätzliche Skill-Metadaten liegen jeweils in `metadata.json`.

Weitere Entwicklungs-, Build- und Release-Informationen stehen in [`CONTRIBUTING.md`](CONTRIBUTING.md).
