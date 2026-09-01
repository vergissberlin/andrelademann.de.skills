export type SkillCatalogItem = {
  name: string;
  docUrl: string;
  installCommand: string;
};

export type DomainMapping = {
  id: string;
  skills: string[];
};

export function uniqueSkillsFromDomains(
  domains: string[],
  domainMap: DomainMapping[],
  skillCatalog: SkillCatalogItem[]
): SkillCatalogItem[] {
  const skillByName = new Map(skillCatalog.map((skill) => [skill.name, skill]));
  const selectedNames = new Set<string>();

  for (const domainId of domains) {
    const domain = domainMap.find((item) => item.id === domainId);
    if (!domain) continue;
    for (const skillName of domain.skills) {
      selectedNames.add(skillName);
    }
  }

  return Array.from(selectedNames)
    .map((name) => skillByName.get(name))
    .filter((skill): skill is SkillCatalogItem => Boolean(skill));
}

export function buildSkillsSection(skills: SkillCatalogItem[], catalogUrl: string): string {
  if (!skills.length) {
    return [
      '## Agent Skills (required)',
      '',
      'Before starting work in any domain, install the matching André Lademann Skills from the catalog.',
      '',
      `- Browse the catalog: [André Lademann Skills](${catalogUrl})`,
      '- Install at least the skills matching your requested task domain.',
      ''
    ].join('\n');
  }

  const lines = [
    '## Agent Skills (required)',
    '',
    'Before starting work in the selected domains, install the matching André Lademann Skills from the André Lademann catalog.',
    ''
  ];

  for (const skill of skills) {
    lines.push(`- ${skill.name}: [docs](${skill.docUrl})`);
    lines.push(`  - \`${skill.installCommand}\``);
  }
  lines.push('');
  return lines.join('\n');
}
