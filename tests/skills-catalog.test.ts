import { existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./plugins/utils.js";

type SkillEntry = {
  name: string;
  path: string;
  description: string;
};

type SkillCatalog = {
  name: string;
  version: string;
  skills: SkillEntry[];
};

const REPO_ROOT = resolve(import.meta.dirname, "..");
const CATALOG_PATH = join(REPO_ROOT, "index.json");
const PLUGIN_PATH = join(REPO_ROOT, ".claude-plugin", "plugin.json");
const MARKETPLACE_PATH = join(REPO_ROOT, ".claude-plugin", "marketplace.json");

function loadCatalog(): SkillCatalog {
  const raw = readFileSync(CATALOG_PATH, "utf-8");
  return JSON.parse(raw) as SkillCatalog;
}

describe("Skills catalog validation", () => {
  it("should have a valid root index.json", () => {
    expect(existsSync(CATALOG_PATH)).toBe(true);
    const catalog = loadCatalog();
    expect(catalog.name).toBeTruthy();
    expect(catalog.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(Array.isArray(catalog.skills)).toBe(true);
    expect(catalog.skills.length).toBeGreaterThan(0);
  });

  it("should expose a synchronized Claude marketplace plugin", () => {
    const catalog = loadCatalog();
    const plugin = JSON.parse(readFileSync(PLUGIN_PATH, "utf-8")) as {
      name: string;
      version: string;
    };
    const marketplace = JSON.parse(
      readFileSync(MARKETPLACE_PATH, "utf-8")
    ) as {
      $schema: string;
      metadata: { version: string };
      plugins: Array<{ name: string; source: string; version: string }>;
    };

    expect(marketplace.$schema).toBe(
      "https://json.schemastore.org/claude-code-marketplace.json"
    );
    const rootMarketplacePlugin = marketplace.plugins.find((entry) => entry.name === plugin.name);
    expect(rootMarketplacePlugin).toBeDefined();
    expect(rootMarketplacePlugin).toMatchObject({
      name: plugin.name,
      source: "./",
      version: catalog.version,
    });
    expect(plugin.version).toBe(catalog.version);
    expect(marketplace.metadata.version).toBe(catalog.version);
  });

  it("should reference existing skill files with non-empty metadata and body", () => {
    const catalog = loadCatalog();

    for (const skill of catalog.skills) {
      const absoluteSkillPath = join(REPO_ROOT, skill.path);
      expect(existsSync(absoluteSkillPath), `${skill.name} path missing`).toBe(
        true
      );

      const { frontmatter, body } = parseFrontmatter(absoluteSkillPath);
      expect(typeof frontmatter["name"]).toBe("string");
      expect(typeof frontmatter["description"]).toBe("string");
      expect(String(frontmatter["name"])).toBe(skill.name);
      expect(String(frontmatter["description"]).trim().length).toBeGreaterThan(
        0
      );
      expect(skill.description.trim().length).toBeGreaterThan(0);
      expect(body.trim().length).toBeGreaterThan(0);

      const expectedDirName = basename(dirname(absoluteSkillPath));
      expect(expectedDirName).toBe(skill.name);
      expect(skill.path.endsWith(`/${skill.name}/SKILL.md`)).toBe(true);
    }
  });
});
