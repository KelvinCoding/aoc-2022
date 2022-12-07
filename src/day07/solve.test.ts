import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

interface Dir {
  name: string;
  files: Record<string, number>;
  dirs: Record<string, Dir>;
  size: number;
  parent?: Dir;
}

type Command = 'cd' | 'ls' | 'dir';

function parseInput(input: string): Dir {
  const allLines = input.split('\n');
  let pos = 1;

  const rootDir: Dir = {
    name: '/',
    files: {},
    dirs: {},
    size: 0,
  };

  let currentDir = rootDir;
  while (pos < allLines.length) {
    const currentLine = allLines[pos];
    const [, command, dirName = null] = currentLine.split(' ');

    if (command === 'cd') {
      if (dirName === '/') {
        currentDir = rootDir;
      } else if (dirName === '..') {
        if (currentDir.parent) currentDir = currentDir.parent;
      } else {
        currentDir.dirs[dirName] ??= {
          name: dirName,
          files: {},
          dirs: {},
          parent: currentDir,
          size: 0,
        };
        currentDir = currentDir.dirs[dirName];
      }
    } else if (command === 'ls') {
      pos += 1;
      let lsOutput = allLines[pos];
      while (lsOutput && !lsOutput?.startsWith('$')) {
        const [dirOrSize, fileOrDirName] = lsOutput.split(' ');
        if (dirOrSize === 'dir') {
          currentDir.dirs[fileOrDirName] ??= {
            name: fileOrDirName,
            files: {},
            dirs: {},
            parent: currentDir,
            size: 0,
          };
        } else {
          currentDir.files[fileOrDirName] = parseInt(dirOrSize, 10);
        }
        pos += 1;
        lsOutput = allLines[pos];
      }
      pos -= 1;
    }

    pos += 1;
  }

  processDirSizes(rootDir);

  return rootDir;
}
type ParsedInput = ReturnType<typeof parseInput>;

function processDirSizes(dir: Dir): number {
  const filesSize = Object.values(dir.files).reduce(
    (acc, size) => acc + size,
    0
  );

  const subDirSize = Object.values(dir.dirs).reduce(
    (acc, dir) => acc + processDirSizes(dir),
    0
  );

  dir.size = filesSize + subDirSize;
  return dir.size;
}

function getDirsLessThan(dir: Dir, limit: number): Dir[] {
  return Object.values(dir.dirs).reduce((acc, dir) => {
    const subDirs = getDirsLessThan(dir, limit);
    acc.push(...subDirs);

    if (dir.size <= limit) {
      acc.push(dir);
    }
    return acc;
  }, [] as Dir[]);
}

function solve1(inputData: ParsedInput) {
  const dirs = getDirsLessThan(inputData, 100_000);

  return dirs.reduce((acc, dir) => acc + dir.size, 0);
}

function findSmallestSubDirMoreThan(dir: Dir, limit: number): number {
  if (dir.size <= limit) {
    return Number.MAX_SAFE_INTEGER;
  }

  let dirSize = dir.size;

  for (const subDir of Object.values(dir.dirs)) {
    const subDirSize = findSmallestSubDirMoreThan(subDir, limit);
    if (subDirSize < dirSize && subDirSize > limit) {
      dirSize = subDirSize;
    }
  }

  return dirSize;
}

function solve2(inputData: ParsedInput) {
  const spaceNeeded = 30_000_000;
  const maxSpace = 70_000_000;

  const minSpaceToFree = inputData.size - (maxSpace - spaceNeeded);

  return findSmallestSubDirMoreThan(inputData, minSpaceToFree);
}

describe('day 07', () => {
  describe('test input', () => {
    let inputData: ParsedInput;

    beforeAll(() => {
      const input = fs
        .readFileSync(path.join(__dirname, 'input-test.txt'), 'utf-8')
        .trimEnd();

      inputData = parseInput(input);
    });

    it('solves the first problem', () => {
      const result = solve1(inputData);
      expect(result).toBe(95437);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);
      expect(result).toBe(24933642);
    });
  });

  describe('actual input', () => {
    let inputData: ParsedInput;

    beforeAll(() => {
      const input = fs
        .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
        .trimEnd();

      inputData = parseInput(input);
    });

    it('solves the first problem', () => {
      const result = solve1(inputData);
      console.log('First solution:', result);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);
      console.log('Second solution:', result);
    });
  });
});
