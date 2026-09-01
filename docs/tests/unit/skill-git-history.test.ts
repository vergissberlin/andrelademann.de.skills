import { describe, expect, it } from 'vitest';
import { buildCommitGroups, parseSkillGitLog, resolvePreferredSemVerTag } from '../../src/lib/skillGitHistory';

describe('skillGitHistory', () => {
  it('parses git log records into commits', () => {
    const raw =
      'abc123\u0000Alex Doe\u0000alex@example.com\u00001713395000\u0000feat: add history panel\u0001' +
      'def456\u0000Sam Roe\u0000sam@example.com\u00001713396000\u0000fix: improve accordion styles\u0001';
    const commits = parseSkillGitLog(raw);

    expect(commits).toHaveLength(2);
    expect(commits[0]).toMatchObject({
      hash: 'abc123',
      authorName: 'Alex Doe',
      authorEmail: 'alex@example.com',
      message: 'feat: add history panel',
    });
  });

  it('creates unreleased and tagged groups in order', () => {
    const commits = parseSkillGitLog(
      'a1\u0000Alex Doe\u0000alex@example.com\u00001713395000\u0000feat: unreleased\u0001' +
        'b2\u0000Sam Roe\u0000sam@example.com\u00001713394000\u0000feat: v2 baseline\u0001' +
        'c3\u0000Kai Poe\u0000kai@example.com\u00001713393000\u0000fix: patch in v2\u0001' +
        'd4\u0000Lou Moe\u0000lou@example.com\u00001713392000\u0000feat: v1 baseline\u0001',
    );

    const groups = buildCommitGroups(
      commits,
      new Map([
        ['a1', null],
        ['b2', 'v2.0.0'],
        ['c3', null],
        ['d4', '1.5.0'],
      ]),
    );

    expect(groups.map((group) => group.label)).toEqual(['Unreleased', 'v2.0.0', '1.5.0']);
    expect(groups[1].commits.map((commit) => commit.hash)).toEqual(['b2', 'c3']);
  });

  it('chooses the highest semver tag from multiple tags', () => {
    const result = resolvePreferredSemVerTag(['latest', 'v1.4.0', '1.12.0', 'v2.0.0-beta.1']);
    expect(result).toBe('v2.0.0-beta.1');
  });
});
