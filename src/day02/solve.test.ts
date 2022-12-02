import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function solve1(lines: string[]): void {}
function solve2(lines: string[]): void {}

describe.skip('day 02', () => {
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
      expect(result).toBe(false);
    });

    it('solves the second problem', () => {
      const result = solve2(lines);
      expect(result).toBe(false);
    });
  });

  describe('actual input', () => {
    let lines: string[];
    beforeAll(() => {
      const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
      lines = input.split('\n');
    });

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
