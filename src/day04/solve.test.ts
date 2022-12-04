import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function solve1(lines: string[]) {
  return lines.reduce((acc, line) => {
    if (!line) {
      return acc;
    }

    const [[aStart, aEnd], [bStart, bEnd]] = line
      .split(',')
      .map((str) => str.split('-').map((s) => parseInt(s, 10)));

    const isBWithinA = aStart <= bStart && bEnd <= aEnd;
    const isAWithinB = bStart <= aStart && aEnd <= bEnd;

    if (isBWithinA || isAWithinB) {
      return acc + 1;
    }

    return acc;
  }, 0);
}

function solve2(lines: string[]) {
  return lines.reduce((acc, line) => {
    if (!line) {
      return acc;
    }

    const [[aStart, aEnd], [bStart, bEnd]] = line
      .split(',')
      .map((str) => str.split('-').map((s) => parseInt(s, 10)));

    const hasIntersection =
      (aStart >= bStart && aStart <= bEnd) ||
      (bStart >= aStart && bStart <= aEnd);

    if (hasIntersection) {
      return acc + 1;
    }

    return acc;
  }, 0);
}

describe('day 04', () => {
  describe('test input', () => {
    let lines: string[];

    beforeAll(() => {
      const input = fs.readFileSync(
        path.join(__dirname, 'input-test.txt'),
        'utf-8'
      );
      lines = input.split('\n');
    });

    it('solves the first problem', () => {
      const top = solve1(lines);
      expect(top).toBe(2);
    });

    it('solves the second problem', () => {
      const sum = solve2(lines);
      expect(sum).toBe(4);
    });
  });

  describe('actual input', () => {
    let lines: string[];

    beforeAll(() => {
      const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
      lines = input.split('\n');
    });

    it('solves the first problem', () => {
      const top = solve1(lines);
      console.log('First solution:', top);
    });

    it('solves the second problem', () => {
      const sum = solve2(lines);
      console.log('Second solution:', sum);
    });
  });
});
