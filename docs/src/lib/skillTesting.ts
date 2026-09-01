import fs from 'node:fs/promises';
import path from 'node:path';

export type SkillHarnessScenarioResult = {
  skill_name: string;
  scenario: string;
  passed: boolean;
  score: number;
};

export type SkillHarnessResult = {
  skill_name: string;
  total_scenarios: number;
  passed: number;
  failed: number;
  pass_rate: number;
  avg_score: number;
  evaluation_source?: 'harness' | 'catalog_only';
  status?: 'passed' | 'failed' | 'catalog_only' | 'error';
  results: SkillHarnessScenarioResult[];
};

export type HarnessResultsSnapshot = {
  mode: string;
  skills: SkillHarnessResult[];
};

const HARNESS_RESULTS_PATH = path.join(process.cwd(), 'src', 'data', 'harness-results.json');

export async function skillHasHarnessFixtures(skillName: string, repoRoot: string): Promise<boolean> {
  const baseDir = path.join(repoRoot, 'tests', 'scenarios', skillName);
  const scenariosPath = path.join(baseDir, 'scenarios.yaml');
  const criteriaPath = path.join(baseDir, 'acceptance-criteria.md');

  try {
    const [scenariosStat, criteriaStat] = await Promise.all([
      fs.stat(scenariosPath),
      fs.stat(criteriaPath),
    ]);

    return scenariosStat.isFile() && criteriaStat.isFile();
  } catch {
    return false;
  }
}

export async function loadHarnessResults(): Promise<HarnessResultsSnapshot | null> {
  try {
    const raw = await fs.readFile(HARNESS_RESULTS_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<HarnessResultsSnapshot>;
    if (!Array.isArray(parsed.skills) || typeof parsed.mode !== 'string') return null;
    return {
      mode: parsed.mode,
      skills: parsed.skills as SkillHarnessResult[],
    };
  } catch {
    return null;
  }
}

export function getSkillHarnessResult(
  snapshot: HarnessResultsSnapshot | null,
  skillName: string,
): SkillHarnessResult | null {
  if (!snapshot) return null;
  return snapshot.skills.find((entry) => entry.skill_name === skillName) ?? null;
}
