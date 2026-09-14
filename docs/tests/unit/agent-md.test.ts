import { describe, expect, it } from 'vitest';
import { buildSkillsSection, uniqueSkillsFromDomains, type DomainMapping, type SkillCatalogItem } from '../../src/lib/agentMd';

const domainMap: DomainMapping[] = [
  { id: 'blog', skills: ['andrelademann-blog-post-writer'] },
  { id: 'editorial', skills: ['andrelademann-blog-header-image', 'andrelademann-blog-post-writer'] }
];

const skillCatalog: SkillCatalogItem[] = [
  {
    name: 'andrelademann-blog-post-writer',
    docUrl: '/andrelademann.de.skills/skills/andrelademann-blog-post-writer/',
    installCommand: 'npx skills add vergissberlin/andrelademann.de.skills@2.0.0 --skill andrelademann-blog-post-writer'
  },
  {
    name: 'andrelademann-blog-header-image',
    docUrl: '/andrelademann.de.skills/skills/andrelademann-blog-header-image/',
    installCommand: 'npx skills add vergissberlin/andrelademann.de.skills@2.0.0 --skill andrelademann-blog-header-image'
  }
];

describe('uniqueSkillsFromDomains', () => {
  it('returns unique skills across multiple domains', () => {
    const result = uniqueSkillsFromDomains(['blog', 'editorial'], domainMap, skillCatalog);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.name)).toEqual([
      'andrelademann-blog-post-writer',
      'andrelademann-blog-header-image'
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
    expect(markdown).toContain('- andrelademann-blog-post-writer: [docs](/andrelademann.de.skills/skills/andrelademann-blog-post-writer/)');
    expect(markdown).toContain('`npx skills add vergissberlin/andrelademann.de.skills@2.0.0 --skill andrelademann-blog-post-writer`');
  });
});
