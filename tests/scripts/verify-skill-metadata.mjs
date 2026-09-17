import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const indexPath = path.join(repoRoot, "index.json");
const autoFixVersion = process.argv.includes("--fix-version");

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value)
    && value.length > 0
    && value.every((entry) => isNonEmptyString(entry));
}

function extractFrontmatterVersion(markdown) {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  try {
    const frontmatter = parseYaml(frontmatterMatch[1]);
    return frontmatter?.metadata?.version ?? frontmatter?.version ?? null;
  } catch {
    return null;
  }
}

const indexRaw = await fs.readFile(indexPath, "utf8");
const catalog = JSON.parse(indexRaw);
const missing = [];
const invalid = [];
const fixed = [];

for (const skill of catalog.skills ?? []) {
  const skillPath = path.join(repoRoot, skill.path);
  const skillDir = path.dirname(skillPath);
  const metadataPath = path.join(skillDir, "metadata.json");
  const relMetadataPath = path.relative(repoRoot, metadataPath);

  if (!(await pathExists(metadataPath))) {
    missing.push(relMetadataPath);
    continue;
  }

  let metadata;
  try {
    metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
  } catch (error) {
    invalid.push(`${relMetadataPath} (invalid JSON: ${error.message})`);
    continue;
  }

  const hasTitle = isNonEmptyString(metadata.title);
  const hasOwnerPrefixInTitle = hasTitle && /^andré lademann\b/i.test(metadata.title.trim());
  const hasAuthor = isNonEmptyString(metadata.author);
  const hasDescription = isNonEmptyString(metadata.description);
  const hasPurpose = isNonEmptyString(metadata.purpose);
  const hasTags = isNonEmptyStringArray(metadata.tags);
  const hasSource = isNonEmptyString(metadata.source);
  let hasVersion = isNonEmptyString(metadata.version);

  if (!hasVersion && autoFixVersion) {
    metadata.version = catalog.version;
    await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
    fixed.push(relMetadataPath);
    hasVersion = true;
  }

  if (!hasTitle || hasOwnerPrefixInTitle || !hasAuthor || !hasDescription || !hasPurpose || !hasTags || !hasSource || !hasVersion) {
    const missingFields = [];
    if (!hasTitle) missingFields.push("title");
    if (hasOwnerPrefixInTitle) missingFields.push("title must not start with 'André Lademann'");
    if (!hasAuthor) missingFields.push("author");
    if (!hasDescription) missingFields.push("description");
    if (!hasPurpose) missingFields.push("purpose");
    if (!hasTags) missingFields.push("tags");
    if (!hasSource) missingFields.push("source");
    if (!hasVersion) missingFields.push("version");
    invalid.push(`${relMetadataPath} (missing/empty: ${missingFields.join(", ")})`);
    continue;
  }

  const skillMarkdown = await fs.readFile(skillPath, "utf8");
  const frontmatterVersion = extractFrontmatterVersion(skillMarkdown);
  if (frontmatterVersion !== catalog.version) {
    invalid.push(`${skill.path} (version ${frontmatterVersion ?? "missing"} does not match catalog ${catalog.version})`);
  }
  if (metadata.version !== catalog.version) {
    invalid.push(`${relMetadataPath} (version ${metadata.version} does not match catalog ${catalog.version})`);
  }
}

if (missing.length || invalid.length) {
  console.error("Skill metadata validation failed.");
  if (missing.length) {
    console.error("\nMissing metadata.json files:");
    for (const entry of missing) console.error(`- ${entry}`);
  }
  if (invalid.length) {
    console.error("\nInvalid metadata.json files:");
    for (const entry of invalid) console.error(`- ${entry}`);
  }
  process.exit(1);
}

if (fixed.length > 0) {
  console.log(`Auto-fixed missing version in ${fixed.length} metadata files.`);
  for (const entry of fixed) {
    console.log(`- ${entry}`);
  }
}

console.log(`Skill metadata check passed for ${catalog.skills.length} skills.`);
