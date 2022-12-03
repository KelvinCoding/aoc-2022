import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import { chunkArr } from '~/helpers/chunk';

const values = new Array(26)
  .fill('')
  .map((_, i) => String.fromCharCode(97 + i))
  .concat(new Array(26).fill('').map((_, i) => String.fromCharCode(65 + i)));

function getValueOfChar(char: string) {
  return values.indexOf(char) + 1;
}

function solve1(lines: string[]): number {
  const charValues = lines.slice(0).map((line) => {
    const firstHalf = new Set(line.slice(0, line.length / 2));
    const secondHalf = [...line.slice(line.length / 2)];

    const intersection = secondHalf.find((char) => {
      return firstHalf.has(char);
    });

    return getValueOfChar(intersection);
  });

  const result = charValues.reduce((acc, value) => acc + value, 0);
  return result;
}

function intersect(a: Set<string>, b: Set<string>) {
  return new Set([...a].filter((x) => b.has(x)));
}

function solve2(lines: string[]) {
  const chunks = chunkArr(lines, 3);

  const charValues = chunks.map((chunk) => {
    const [a, b, c] = chunk.map((line) => new Set(line));
    const abIntersect = intersect(a, b);
    const [charIntersect] = [...intersect(abIntersect, c)];

    return getValueOfChar(charIntersect);
  });

  const result = charValues.reduce((acc, value) => acc + value, 0);

  return result;
}

describe('day 03', () => {
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
      const result = solve1(lines);
      expect(result).toBe(157);
    });

    it('solves the second problem', () => {
      const result = solve2(lines);
      expect(result).toBe(70);
    });
  });

  describe('actual input', () => {
    let lines: string[];
    beforeAll(() => {
      const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
      lines = input.split('\n');
    });

    describe('original', () => {
      it('solves the first problem', () => {
        const result = solve1(lines);
        console.log('First solution:', result);
      });

      it('solves the second problem', () => {
        const result = solve2(lines);
        console.log('Second solution:', result);
      });
    });
  });
});
