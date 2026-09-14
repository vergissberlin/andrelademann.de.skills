# Tool integrations

Der Katalog bleibt bewusst runtime-frei: Die Vorlagen verweisen auf vorhandene `SKILL.md`-Dateien und `index.json`, statt einen eigenen Server oder ein npm-Paket einzuführen.

| Tool | Empfohlener Mechanismus | Vorlage |
| --- | --- | --- |
| Claude Code / Claude Desktop | Claude-Code-Marketplace | [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json) |
| Cursor | Project Rule im MDC-Format | [`cursor/skills.mdc`](cursor/skills.mdc) |
| GitHub Copilot | Repository-weite Custom Instructions | [`copilot/copilot-instructions.md`](copilot/copilot-instructions.md) |
| VS Code | Copilot-Instructions-Datei oder Custom-Instructions-Setting | [`vscode/README.md`](vscode/README.md) |
| ChatGPT | Custom-GPT-Instructions plus Knowledge-Upload | [`chatgpt/custom-gpt-instructions.md`](chatgpt/custom-gpt-instructions.md) |

Die Vorlagen sind Copy-Paste-Startpunkte. Die jeweils relevanten `SKILL.md`-Dateien bleiben die fachliche Quelle; die Vorlagen enthalten keine zweite Skill-Implementierung.
