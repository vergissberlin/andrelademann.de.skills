import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const FIELD_SEPARATOR = '\u0000';
const RECORD_SEPARATOR = '\u0001';

export type SkillGitCommit = {
  hash: string;
  authorName: string;
  authorEmail: string;
  message: string;
  committedAt: Date;
};

export type SkillGitCommitGroup = {
  label: string;
  tag?: string;
  commits: SkillGitCommit[];
};

type ParsedSemVer = {
  major: number;
  minor: number;
  patch: number;
  preRelease?: string;
};

const SEMVER_TAG_REGEX = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

export function parseSkillGitLog(raw: string): SkillGitCommit[] {
  if (!raw.trim()) return [];

  return raw
    .split(RECORD_SEPARATOR)
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [hash, authorName, authorEmail, committedAtUnix, message] = record.split(FIELD_SEPARATOR);
      const committedAtMillis = Number(committedAtUnix) * 1000;

      if (!hash || !authorName || !authorEmail || !message || !Number.isFinite(committedAtMillis)) {
        return null;
      }

      return {
        hash,
        authorName,
        authorEmail,
        message,
        committedAt: new Date(committedAtMillis),
      } satisfies SkillGitCommit;
    })
    .filter((entry): entry is SkillGitCommit => entry !== null);
}

function parseSemVerTag(tag: string): ParsedSemVer | null {
  const match = tag.trim().match(SEMVER_TAG_REGEX);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    preRelease: match[4],
  };
}

function compareSemVerDesc(left: ParsedSemVer, right: ParsedSemVer): number {
  if (left.major !== right.major) return right.major - left.major;
  if (left.minor !== right.minor) return right.minor - left.minor;
  if (left.patch !== right.patch) return right.patch - left.patch;
  if (left.preRelease && !right.preRelease) return 1;
  if (!left.preRelease && right.preRelease) return -1;
  if (left.preRelease && right.preRelease) return right.preRelease.localeCompare(left.preRelease);
  return 0;
}

export function resolvePreferredSemVerTag(tags: string[]): string | null {
  const parsed = tags
    .map((tag) => ({ tag, semver: parseSemVerTag(tag) }))
    .filter((entry): entry is { tag: string; semver: ParsedSemVer } => entry.semver !== null)
    .sort((a, b) => compareSemVerDesc(a.semver, b.semver) || a.tag.localeCompare(b.tag));
  return parsed[0]?.tag ?? null;
}

async function getTagsForCommit(hash: string, cwd?: string): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync('git', ['tag', '--points-at', hash], { cwd });
    return stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => parseSemVerTag(line) !== null);
  } catch {
    return [];
  }
}

export async function groupCommitsByTag(
  commits: SkillGitCommit[],
  options?: { cwd?: string },
): Promise<SkillGitCommitGroup[]> {
  if (commits.length === 0) return [];

  const tagsByHash = new Map<string, string | null>();
  await Promise.all(
    commits.map(async (commit) => {
      const tags = await getTagsForCommit(commit.hash, options?.cwd);
      tagsByHash.set(commit.hash, resolvePreferredSemVerTag(tags));
    }),
  );

  return buildCommitGroups(commits, tagsByHash);
}

export function buildCommitGroups(
  commits: SkillGitCommit[],
  tagsByHash: Map<string, string | null>,
): SkillGitCommitGroup[] {
  const groups: SkillGitCommitGroup[] = [];
  let currentGroup: SkillGitCommitGroup = { label: 'Unreleased', commits: [] };

  for (const commit of commits) {
    const matchingTag = tagsByHash.get(commit.hash) ?? null;

    if (matchingTag && currentGroup.tag !== matchingTag) {
      if (currentGroup.commits.length > 0) groups.push(currentGroup);
      currentGroup = { label: matchingTag, tag: matchingTag, commits: [] };
    }

    currentGroup.commits.push(commit);
  }

  if (currentGroup.commits.length > 0) groups.push(currentGroup);
  return groups;
}

export async function getSkillGitCommits(
  skillPathFromIndex: string,
  options?: { limit?: number; cwd?: string },
): Promise<SkillGitCommit[]> {
  const limit = options?.limit ?? 30;

  try {
    // skillPathFromIndex is repo-root-relative, so cwd must point to git top-level.
    const { stdout } = await execFileAsync(
      'git',
      [
        'log',
        '--follow',
        '--date-order',
        `--max-count=${limit}`,
        `--pretty=format:%H%x00%an%x00%ae%x00%ct%x00%s%x01`,
        '--',
        skillPathFromIndex,
      ],
      { cwd: options?.cwd },
    );

    return parseSkillGitLog(stdout);
  } catch {
    return [];
  }
}

export async function getSkillGitCommitGroups(
  skillPathFromIndex: string,
  options?: { limit?: number; cwd?: string },
): Promise<SkillGitCommitGroup[]> {
  const commits = await getSkillGitCommits(skillPathFromIndex, options);
  return groupCommitsByTag(commits, { cwd: options?.cwd });
}
