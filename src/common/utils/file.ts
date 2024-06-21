import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import { join } from 'path';

async function searchFile(dir: string, filename: string): Promise<string | null> {
  let files: Dirent[] = [];
  files = await fs.readdir(dir, { withFileTypes: true });
  for (let file of files) {
    let fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      try {
        const found = await searchFile(fullPath, filename);
        if (found) return found;
      } catch (err) {
        continue;
      }
    } else if (file.isFile() && file.name === filename) {
      return fullPath;
    }
  }
  return null;
}

async function isExistsFile(directory, filename): Promise<boolean> {
  const foundPath = await searchFile(directory, filename);
  const isExists = foundPath ? true : false;
  return isExists;
}

export {
  isExistsFile,
};
