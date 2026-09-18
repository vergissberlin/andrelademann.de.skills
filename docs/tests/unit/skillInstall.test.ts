import { describe, expect, it } from 'vitest';
import {
  buildAgentSkillInstallCommand,
  buildSkillInstallCommand,
  buildSkillsRepositoryRef,
} from '../../src/lib/skillInstall';

describe('skill install commands', () => {
  it('pins repository installs to the normalized catalog version', () => {
    expect(buildSkillsRepositoryRef('v2.4.1')).toBe('vergissberlin/skills@2.4.1');
    expect(buildSkillInstallCommand('2.4.1', 'example-skill')).toBe(
      'npx skills add vergissberlin/skills@2.4.1 --skill example-skill',
    );
  });

  it('targets supported editor agents non-interactively', () => {
    expect(buildAgentSkillInstallCommand('2.4.1', 'example-skill', 'cursor')).toMatch(
      /--skill example-skill --agent cursor --yes$/,
    );
    expect(buildAgentSkillInstallCommand('2.4.1', 'example-skill', 'github-copilot')).toMatch(
      /--skill example-skill --agent github-copilot --yes$/,
    );
  });
});
