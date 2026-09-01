import { describe, expect, it } from 'vitest';
import { buildSkillsSection, uniqueSkillsFromDomains, type DomainMapping, type SkillCatalogItem } from '../../src/lib/agentMd';

const domainMap: DomainMapping[] = [
  { id: 'infra', skills: ['iac-infrastructure-as-code'] },
  { id: 'terraform', skills: ['terraform-style-guide', 'iac-infrastructure-as-code'] }
];

const skillCatalog: SkillCatalogItem[] = [
  {
    name: 'iac-infrastructure-as-code',
    docUrl: '/andrelademann.de.skills/skills/iac-infrastructure-as-code/',
    installCommand: 'npx skills add vergissberlin/andrelademann.de.skills@1.2.0 --skill iac-infrastructure-as-code'
  },
  {
    name: 'terraform-style-guide',
    docUrl: '/andrelademann.de.skills/skills/terraform-style-guide/',
    installCommand: 'npx skills add vergissberlin/andrelademann.de.skills@1.2.0 --skill terraform-style-guide'
  }
];

describe('uniqueSkillsFromDomains', () => {
  it('returns unique skills across multiple domains', () => {
    const result = uniqueSkillsFromDomains(['infra', 'terraform'], domainMap, skillCatalog);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.name)).toEqual([
      'iac-infrastructure-as-code',
      'terraform-style-guide'
    ]);
  });

  it('ignores unknown domains', () => {
    const result = uniqueSkillsFromDomains(['unknown'], domainMap, skillCatalog);
    expect(result).toEqual([]);
  });
});

describe('buildSkillsSection', () => {
  it('renders fallback section when no skills are selected', () => {
    const markdown = buildSkillsSection([], '/andrelademann.de.skills/');
    expect(markdown).toContain('Install at least the skills matching your requested task domain.');
    expect(markdown).toContain('[André Lademann Skills](/andrelademann.de.skills/)');
  });

  it('renders selected skills with docs links and install commands', () => {
    const markdown = buildSkillsSection([skillCatalog[0]], '/andrelademann.de.skills/');
    expect(markdown).toContain('- iac-infrastructure-as-code: [docs](/andrelademann.de.skills/skills/iac-infrastructure-as-code/)');
    expect(markdown).toContain('`npx skills add vergissberlin/andrelademann.de.skills@1.2.0 --skill iac-infrastructure-as-code`');
  });
});
