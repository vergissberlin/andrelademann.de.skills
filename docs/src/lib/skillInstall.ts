export const SKILLS_REPOSITORY = 'vergissberlin/andrelademann.de.skills';

function normalizeTagRef(version: string): string {
  const normalized = version.trim();
  return normalized.replace(/^v/i, '');
}

export function buildSkillsRepositoryRef(catalogVersion: string): string {
  return `${SKILLS_REPOSITORY}@${normalizeTagRef(catalogVersion)}`;
}

export function buildSkillInstallCommand(catalogVersion: string, skillName: string): string {
  return `npx skills add ${buildSkillsRepositoryRef(catalogVersion)} --skill ${skillName}`;
}

export type SkillInstallAgent = 'cursor' | 'github-copilot';

export function buildAgentSkillInstallCommand(
  catalogVersion: string,
  skillName: string,
  agent: SkillInstallAgent,
): string {
  return `${buildSkillInstallCommand(catalogVersion, skillName)} --agent ${agent} --yes`;
}
