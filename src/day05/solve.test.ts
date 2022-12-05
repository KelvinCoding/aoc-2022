import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function createStacks(stacksStr: string) {
  const lineChars = stacksStr
    .split('\n')
    .map((s) => [...s].filter((_, i) => i % 4 === 1));

  const charInfo = lineChars.slice(0, lineChars.length - 1);

  const numStacks = lineChars[0].length;
  const stacks = Array.from({ length: numStacks }, () => new Array<string>());

  for (let i = 0; i < numStacks; i++) {
    charInfo.forEach((s) => {
      const char = s[i];
      if (char === ' ') {
        return;
      }
      stacks[i].push(char);
    });
  }

  return stacks;
}

interface Instructions {
  amount: number;
  start: number;
  end: number;
}

function parseInstructions(instructions: string): Instructions[] {
  return instructions.split('\n').map((line) => {
    const [, amount, , start, , end] = line.split(' ');
    return {
      amount: parseInt(amount, 10),
      start: parseInt(start, 10),
      end: parseInt(end, 10),
    };
  });
}

function solve1(stacks: string[][], instructions: Instructions[]) {
  const slice = stacks.slice().map((s) => s.slice());
  instructions.forEach(({ amount, start, end }) => {
    for (let i = 0; i < amount; i++) {
      slice[end - 1].unshift(slice[start - 1].shift());
    }
  });

  return slice.map(([first]) => first).join('');
}

function solve2(stacks: string[][], instructions: Instructions[]) {
  const slice = stacks.slice().map((s) => s.slice());
  instructions.forEach(({ amount, start, end }) => {
    slice[end - 1].unshift(...slice[start - 1].splice(0, amount));
  });

  return slice.map(([first]) => first).join('');
}

describe('day 05', () => {
  describe('test input', () => {
    let stacks: string[][];
    let instructions: Instructions[];

    beforeAll(() => {
      const input = fs
        .readFileSync(path.join(__dirname, 'input-test.txt'), 'utf-8')
        .trimEnd();
      const [stacksStr, instructionsStr] = input.split('\n\n');
      stacks = createStacks(stacksStr);
      instructions = parseInstructions(instructionsStr);
    });

    it('solves the first problem', () => {
      const result = solve1(stacks, instructions);
      expect(result).toBe('CMZ');
    });

    it('solves the second problem', () => {
      const result = solve2(stacks, instructions);
      expect(result).toBe('MCD');
    });
  });

  describe('actual input', () => {
    let stacks: string[][];
    let instructions: Instructions[];

    beforeAll(() => {
      const input = fs
        .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
        .trimEnd();
      const [stacksStr, instructionsStr] = input.split('\n\n');
      stacks = createStacks(stacksStr);
      instructions = parseInstructions(instructionsStr);
    });

    it('solves the first problem', () => {
      const result = solve1(stacks, instructions);
      console.log('First solution:', result);
    });

    it('solves the second problem', () => {
      const result = solve2(stacks, instructions);
      console.log('Second solution:', result);
    });
  });
});
