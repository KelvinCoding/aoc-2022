import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function parseInput(input: string) {
  return [...input];
}

type ParsedInput = ReturnType<typeof parseInput>;

function solve1(inputData: ParsedInput) {
  const size = 4;
  for (let i = size; i < inputData.length; i++) {
    const slice = new Set(inputData.slice(i - size, i));

    if (slice.size === size) {
      return i;
    }
  }

  return 0;
}

function solve2(inputData: ParsedInput) {
  const size = 14;
  for (let i = size; i < inputData.length; i++) {
    const slice = new Set(inputData.slice(i - size, i));

    if (slice.size === size) {
      return i;
    }
  }

  return 0;
}

describe('day 06', () => {
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
      expect(result).toBe(11);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);
      expect(result).toBe(26);
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
