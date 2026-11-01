import { existsSync } from 'node:fs';
import path from 'node:path';

export const shotsDir: string = path.join(process.cwd(), 'public', 'projects');

export function hasShot(id: string, dir: string = shotsDir): boolean {
  return existsSync(path.join(dir, `${id}.jpg`));
}
