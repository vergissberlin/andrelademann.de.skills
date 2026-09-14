# VS Code

VS Code with GitHub Copilot reads the repository-wide [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md). Copy that file into another repository's `.github/` directory to onboard Copilot there.

If Copilot is not active or the repository-wide file is not being loaded, add the same content through the VS Code Workspace **Custom Instructions** setting. The relevant `SKILL.md` files should remain available in the workspace or be copied/uploaded as project context.

For Cursor, use the separate [MDC rule](../cursor/skills.mdc). This integration does not add a VS Code extension, server, or package.
