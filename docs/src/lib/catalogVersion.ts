import fs from 'node:fs';
import path from 'node:path';

/**
 * Catalog/release version from `index.json` at the docs project root.
 * In CI this file is a copy of the repo root catalog; the value matches the release git tag.
 */
export function getCatalogVersion(): string | null {
  const indexPath = path.join(process.cwd(), 'index.json');
  try {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const { version } = JSON.parse(raw) as { version?: string };
    const v = version?.trim();
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}
