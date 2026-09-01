import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const indexPath = path.join(projectRoot, 'index.json');
const defaultOgPath = path.join(projectRoot, 'public', 'og', 'default.png');
const skillsOgDir = path.join(projectRoot, 'public', 'og', 'skills');

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const indexContent = await fs.readFile(indexPath, 'utf8');
const { skills } = JSON.parse(indexContent);

const missingPaths = [];

if (!(await pathExists(defaultOgPath))) {
  missingPaths.push('public/og/default.png');
}

for (const skill of skills) {
  const expected = path.join(skillsOgDir, `${skill.name}.png`);
  if (!(await pathExists(expected))) {
    missingPaths.push(`public/og/skills/${skill.name}.png`);
  }
}

if (missingPaths.length > 0) {
  console.error('Missing required Open Graph assets:');
  for (const missingPath of missingPaths) {
    console.error(`- ${missingPath}`);
  }
  process.exit(1);
}

console.log(`Open Graph asset check passed for ${skills.length} skills.`);
