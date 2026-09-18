import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const REPO_ROOT = join(import.meta.dirname, "..");
const SCRIPT = join(REPO_ROOT, "skills/meta/vergissberlin-skill-creator/scripts/create-skill.mjs");

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), "vergissberlin-skill-creator-"));
  await mkdir(join(root, "docs"), { recursive: true });
  await mkdir(join(root, "tests"), { recursive: true });
  await mkdir(join(root, "templates"), { recursive: true });
  await mkdir(join(root, ".claude-plugin"), { recursive: true });
  await mkdir(join(root, ".github"), { recursive: true });
  await mkdir(join(root, "integrations/copilot"), { recursive: true });
  await mkdir(join(root, "integrations/cursor"), { recursive: true });
  await writeFile(join(root, "index.json"), JSON.stringify({ name: "test", version: "1.2.3", skills: [] }, null, 2) + "\n");
  await writeFile(join(root, "docs/index.json"), "{}\n");
  await writeFile(join(root, ".claude-plugin/plugin.json"), JSON.stringify({ name: "test", version: "0.0.1" }, null, 2) + "\n");
  await writeFile(join(root, ".claude-plugin/marketplace.json"), JSON.stringify({
    metadata: { version: "0.0.1" },
    plugins: [
      { name: "test", source: "./", version: "0.0.1" },
      { name: "test-research", source: "./skills/research", version: "1.0.0" },
    ],
  }, null, 2) + "\n");
  await writeFile(join(root, "templates/skill-readme.md"), "# {{TITLE}}\n\n{{DESCRIPTION}}\n\n{{PURPOSE}}\n\n{{SOURCE}}\n");
  await writeFile(join(root, "release-please-config.json"), JSON.stringify({ packages: { ".": { "extra-files": [] } } }, null, 2) + "\n");
  for (const file of [
    ".github/copilot-instructions.md",
    "integrations/copilot/copilot-instructions.md",
    "integrations/cursor/skills.mdc",
  ]) await writeFile(join(root, file), "# Catalog\n\nWhen adding or changing a skill, keep the catalog aligned.\n");
  return root;
}

describe("repository skill creator", () => {
  it("creates the skill package, fixtures, catalogs, integrations, and release entries", async () => {
    const root = await createFixture();
    try {
      await execFileAsync(process.execPath, [
        SCRIPT,
        "--repo-root", root,
        "--name", "example-skill",
        "--domain", "meta",
        "--title", "Example Skill",
        "--description", "Create an example skill for a focused workflow.",
        "--purpose", "Use when an example workflow should become reusable.",
        "--tags", "meta,testing",
        "--test-prompt", "Create an example skill and verify its catalog entry.",
      ]);

      const catalog = JSON.parse(await readFile(join(root, "index.json"), "utf8")) as { skills: Array<{ name: string; path: string }> };
      const docsCatalog = await readFile(join(root, "docs/index.json"), "utf8");
      expect(catalog.skills).toEqual([{ name: "example-skill", path: "skills/meta/example-skill/SKILL.md", description: "Create an example skill for a focused workflow." }]);
      expect(docsCatalog).toBe(await readFile(join(root, "index.json"), "utf8"));
      expect(await readFile(join(root, "skills/meta/example-skill/README.md"), "utf8")).not.toContain("{{");
      expect(await readFile(join(root, "tests/scenarios/example-skill/scenarios.yaml"), "utf8")).toContain("primary-workflow");
      expect(await readFile(join(root, "release-please-config.json"), "utf8")).toContain("skills/meta/example-skill/metadata.json");
      expect(await readFile(join(root, ".github/copilot-instructions.md"), "utf8")).toContain("example-skill");
      const marketplace = JSON.parse(await readFile(join(root, ".claude-plugin/marketplace.json"), "utf8")) as {
        metadata: { version: string };
        plugins: Array<{ name: string; source: string; version: string }>;
      };
      expect(marketplace.metadata.version).toBe("1.2.3");
      expect(marketplace.plugins).toEqual([{ name: "test", source: "./", version: "1.2.3" }]);
      const plugin = JSON.parse(await readFile(join(root, ".claude-plugin/plugin.json"), "utf8")) as { version: string };
      expect(plugin.version).toBe("1.2.3");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("refuses to overwrite an existing skill without force", async () => {
    const root = await createFixture();
    try {
      await mkdir(join(root, "skills/meta/example-skill"), { recursive: true });
      await expect(execFileAsync(process.execPath, [
        SCRIPT,
        "--repo-root", root,
        "--name", "example-skill",
        "--domain", "meta",
        "--title", "Example Skill",
        "--description", "Create an example skill for a focused workflow.",
      ])).rejects.toThrow(/already exists/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
