#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

const execFileAsync = promisify(execFile);
const REPOSITORY_URL = 'https://github.com/vergissberlin/andrelademann.de.skills';
const AUTHOR = 'André Lademann';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith('--')) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = argv[index + 1];
    const value = next && !next.startsWith('--') ? next : true;
    if (value !== true) index += 1;
    if (args[key] === undefined) args[key] = value;
    else args[key] = Array.isArray(args[key]) ? [...args[key], value] : [args[key], value];
  }
  return args;
}

function asArray(value) {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).flatMap((entry) =>
    typeof entry === 'string' ? entry.split(',').map((item) => item.trim()).filter(Boolean) : []
  );
}

function assertSlug(value, label) {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${label} must use lowercase kebab-case: ${value ?? '<missing>'}`);
  }
}

function titleFromName(name) {
  return name
    .replace(/^andrelademann-/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function replaceTokens(template, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function buildSkillMarkdown(input, body) {
  const instructions = body?.trim() || `## When to use\n\nUse this skill for ${input.description.toLowerCase()}\n\n## Workflow\n\n1. Inspect the user's context and confirm the scope.\n2. Apply the focused workflow for ${input.title}.\n3. Verify the result against the stated success criteria.\n\n## Output\n\nReport what changed, what was verified, and any remaining limitation.`;
  return `---\nname: ${input.name}\ndescription: ${yamlString(input.description)}\nlicense: MIT\nmetadata:\n  version: ${input.version} # x-release-please-version\n  author: ${yamlString(AUTHOR)}\n  scope: ${input.domain}\n---\n\n# ${input.title}\n\nThis skill belongs to the [André Lademann Skills](${REPOSITORY_URL}) catalog. Invoke it as \`${input.name}\`.\n\n${instructions.trim()}\n`;
}

function buildMetadata(input) {
  return `${JSON.stringify({
    title: input.title,
    author: AUTHOR,
    description: input.description,
    purpose: input.purpose,
    tags: input.tags,
    source: input.source,
    version: input.version,
  }, null, 2)}\n`;
}

function buildEvals(input) {
  return `${JSON.stringify({
    skill_name: input.name,
    evals: input.testPrompts.map((prompt, index) => ({
      id: index + 1,
      prompt,
      expected_output: `A correct, verified result for ${input.title}.`,
      files: [],
    })),
  }, null, 2)}\n`;
}

function buildScenarios(input) {
  const names = ['primary-workflow', 'boundary-case', 'verification-pass'];
  const tags = ['primary', 'edge-case', 'verification'];
  return [
    'config:',
    '  model: gpt-4',
    '  max_tokens: 2000',
    '  temperature: 0.3',
    'scenarios:',
    ...input.testPrompts.map((prompt, index) => [
      `  - name: ${names[index] ?? `workflow-${index + 1}`}`,
      `    prompt: ${yamlString(prompt)}`,
      '    expected_patterns: []',
      '    forbidden_patterns: []',
      `    tags: [${yamlString(tags[index] ?? 'workflow')}]`,
      '    mock_response: |-',
      '      catalog_updated = True',
      '      tests_created = True',
      '      readme_created = True',
      '      verification_complete = True',
    ]).flat(),
    '',
  ].join('\n');
}

function buildAcceptanceCriteria(input) {
  return `# Acceptance criteria for ${input.name}\n\nThe skill must create a complete repository-native skill package and leave the catalog in a valid, synchronized state.\n\n## Repository integration\n\n### ✅ Correct\n\n\`\`\`python\ncatalog_updated = True\ntests_created = True\nreadme_created = True\nverification_complete = True\n\`\`\`\n\n### ❌ Incorrect\n\nNo generated result may claim completion while omitting the catalog, tests, README, or verification step.\n`;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function updateCatalog(repoRoot, input) {
  const catalogPath = path.join(repoRoot, 'index.json');
  const docsCatalogPath = path.join(repoRoot, 'docs', 'index.json');
  const catalog = await readJson(catalogPath);
  if ((catalog.skills ?? []).some((skill) => skill.name === input.name)) {
    throw new Error(`Catalog already contains ${input.name}`);
  }
  catalog.skills = [...(catalog.skills ?? []), {
    name: input.name,
    path: `skills/${input.domain}/${input.name}/SKILL.md`,
    description: input.description,
  }];
  const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
  await fs.writeFile(catalogPath, serialized, 'utf8');
  await fs.writeFile(docsCatalogPath, serialized, 'utf8');
}

async function updateReleaseConfig(repoRoot, input) {
  const configPath = path.join(repoRoot, 'release-please-config.json');
  const config = await readJson(configPath);
  const extraFiles = config.packages?.['.']?.['extra-files'];
  if (!Array.isArray(extraFiles)) throw new Error('release-please-config.json has no extra-files array');
  const skillPath = `skills/${input.domain}/${input.name}/SKILL.md`;
  const metadataPath = `skills/${input.domain}/${input.name}/metadata.json`;
  if (!extraFiles.some((entry) => entry === skillPath)) extraFiles.push(skillPath);
  if (!extraFiles.some((entry) => entry?.path === metadataPath)) {
    extraFiles.push({ type: 'json', path: metadataPath, jsonpath: '$.version' });
  }
  await writeJson(configPath, config);
}

async function updateMarketplace(repoRoot, input) {
  const pluginPath = path.join(repoRoot, '.claude-plugin', 'plugin.json');
  const marketplacePath = path.join(repoRoot, '.claude-plugin', 'marketplace.json');
  const plugin = await readJson(pluginPath);
  const marketplace = await readJson(marketplacePath);
  const rootPlugin = (marketplace.plugins ?? []).find((entry) => entry.name === plugin.name);

  if (!rootPlugin) {
    throw new Error(`Marketplace is missing the root plugin entry ${plugin.name}`);
  }
  if (rootPlugin.source !== './') {
    throw new Error(`Root marketplace plugin ${plugin.name} must use source ./`);
  }

  const catalog = await readJson(path.join(repoRoot, 'index.json'));
  plugin.version = catalog.version;
  marketplace.metadata = { ...(marketplace.metadata ?? {}), version: catalog.version };
  rootPlugin.version = catalog.version;
  marketplace.plugins = [rootPlugin];
  await writeJson(pluginPath, plugin);
  await writeJson(marketplacePath, marketplace);
}

async function updateIntegrationFile(filePath, input) {
  let content = await fs.readFile(filePath, 'utf8');
  const line = `- \`${input.name}\` → \`skills/${input.domain}/${input.name}/SKILL.md\``;
  if (content.includes(line)) return;
  const marker = '\nWhen adding or changing a skill,';
  if (content.includes(marker)) content = content.replace(marker, `\n${line}${marker}`);
  else content = `${content.trimEnd()}\n${line}\n`;
  await fs.writeFile(filePath, content, 'utf8');
}

async function generateOg(repoRoot) {
  const docsRoot = path.join(repoRoot, 'docs');
  try {
    await execFileAsync(process.env.PNPM ?? 'pnpm', ['og:generate'], { cwd: docsRoot });
    return 'generated';
  } catch (error) {
    const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
    return `skipped (${message})`;
  }
}

async function generateHarnessSnapshot(repoRoot) {
  const testsRoot = path.join(repoRoot, 'tests');
  const outputPath = path.join(repoRoot, 'docs', 'src', 'data', 'harness-results.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  try {
    await execFileAsync(process.env.PNPM ?? 'pnpm', [
      'harness', '--all', '--mock', '--output', 'json',
      '--output-file', '../docs/src/data/harness-results.json',
    ], { cwd: testsRoot });
    return 'generated';
  } catch (error) {
    const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
    return `skipped (${message})`;
  }
}

export async function createSkill(rawOptions) {
  const repoRoot = path.resolve(rawOptions.repoRoot ?? process.cwd());
  const input = { ...rawOptions };
  assertSlug(input.name, 'name');
  assertSlug(input.domain, 'domain');
  input.title = input.title ?? titleFromName(input.name);
  if (!input.description) throw new Error('--description is required');
  const catalog = await readJson(path.join(repoRoot, 'index.json'));
  input.version = input.version ?? catalog.version;
  if (!/^\d+\.\d+\.\d+$/.test(input.version)) throw new Error(`version must be semver: ${input.version}`);
  if (input.version !== catalog.version) throw new Error(`version must match catalog.version (${catalog.version}): ${input.version}`);
  input.purpose = input.purpose ?? `Use when ${input.description.charAt(0).toLowerCase()}${input.description.slice(1)}`;
  input.tags = asArray(input.tags);
  if (input.tags.length === 0) input.tags = [input.domain, 'agent-workflows'];
  input.testPrompts = asArray(input.testPrompts ?? input.testPrompt);
  if (input.testPrompts.length === 0) {
    input.testPrompts = [
      `Use ${input.title} for its primary workflow and verify the result.`,
      `Use ${input.title} while handling a realistic edge case or constraint.`,
    ];
  }
  input.source = input.source ?? `${REPOSITORY_URL}/tree/main/skills/${input.domain}/${input.name}`;

  const skillDir = path.join(repoRoot, 'skills', input.domain, input.name);
  const exists = await fs.stat(skillDir).then(() => true).catch(() => false);
  if (exists && !input.force) throw new Error(`${skillDir} already exists; pass --force only with explicit replacement authority`);
  if (exists) await fs.rm(skillDir, { recursive: true, force: true });

  const body = input.bodyFile ? await fs.readFile(path.resolve(input.bodyFile), 'utf8') : input.body;
  const readmeTemplate = await fs.readFile(path.join(repoRoot, 'templates', 'skill-readme.md'), 'utf8');
  const readme = replaceTokens(readmeTemplate, {
    TITLE: input.title,
    NAME: input.name,
    DESCRIPTION: input.description,
    PURPOSE: input.purpose,
    SOURCE: `[Repository source](${input.source})`,
  });
  const scenarioDir = path.join(repoRoot, 'tests', 'scenarios', input.name);
  await fs.mkdir(path.join(skillDir, 'evals'), { recursive: true });
  await fs.mkdir(scenarioDir, { recursive: true });
  await fs.writeFile(path.join(skillDir, 'SKILL.md'), buildSkillMarkdown(input, body), 'utf8');
  await fs.writeFile(path.join(skillDir, 'metadata.json'), buildMetadata(input), 'utf8');
  await fs.writeFile(path.join(skillDir, 'README.md'), readme, 'utf8');
  await fs.writeFile(path.join(skillDir, 'evals', 'evals.json'), buildEvals(input), 'utf8');
  await fs.writeFile(path.join(scenarioDir, 'scenarios.yaml'), buildScenarios(input), 'utf8');
  await fs.writeFile(path.join(scenarioDir, 'acceptance-criteria.md'), buildAcceptanceCriteria(input), 'utf8');

  await updateCatalog(repoRoot, input);
  await updateMarketplace(repoRoot, input);
  await updateReleaseConfig(repoRoot, input);
  for (const relativePath of [
    '.github/copilot-instructions.md',
    'integrations/copilot/copilot-instructions.md',
    'integrations/cursor/skills.mdc',
  ]) await updateIntegrationFile(path.join(repoRoot, relativePath), input);
  const harnessStatus = await generateHarnessSnapshot(repoRoot);
  const ogStatus = await generateOg(repoRoot);
  return { ...input, skillDir, scenarioDir, harnessStatus, ogStatus };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = args.spec ? await readJson(path.resolve(String(args.spec))) : {};
  const options = { ...spec, ...args };
  delete options.spec;
  const result = await createSkill(options);
  console.log(`Created ${result.name} at ${path.relative(result.repoRoot ?? process.cwd(), result.skillDir)}`);
  console.log(`Harness fixtures: ${path.relative(result.repoRoot ?? process.cwd(), result.scenarioDir)}`);
  console.log(`Harness snapshot: ${result.harnessStatus}`);
  console.log(`OG asset: ${result.ogStatus}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Skill creation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
