import { existsSync } from 'node:fs';
import path from 'node:path';

export const profilePhotoDir: string = path.join(process.cwd(), 'public', 'images');

export function hasProfilePhoto(dir: string = profilePhotoDir): boolean {
  return existsSync(path.join(dir, 'eduardo.jpg'));
}
