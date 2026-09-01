import fs from 'node:fs/promises';
import path from 'node:path';

export type SkillFile = {
  name: string;
  relativePath: string;
  fullPath: string;
  githubUrl: string;
};

const REPO_URL = 'https://github.com/vergissberlin/andrelademann.de.skills';

async function listFilesRecursive(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) return listFilesRecursive(entryPath);
    if (!entry.isFile()) return [];
    return [entryPath];
  }));

  return files.flat();
}

export async function getSkillFiles(skillPathFromIndex: string, cwd: string): Promise<SkillFile[]> {
  try {
    const skillDir = path.dirname(skillPathFromIndex);
    const absoluteSkillDir = path.join(cwd, skillDir);
    const files = await listFilesRecursive(absoluteSkillDir);

    return files
      .map((absoluteFilePath) => {
        const fullPath = path.relative(cwd, absoluteFilePath).replaceAll(path.sep, '/');
        const relativePath = path.relative(absoluteSkillDir, absoluteFilePath).replaceAll(path.sep, '/');
        return {
          name: path.basename(absoluteFilePath),
          relativePath,
          fullPath,
          githubUrl: `${REPO_URL}/blob/main/${fullPath}`,
        } satisfies SkillFile;
      })
      .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  } catch {
    return [];
  }
}
