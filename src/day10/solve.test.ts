import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

type NoopInstruction = {
  type: 'noop';
};

type AddxInstruction = {
  type: 'addx';
  value: number;
};

type Instruction = NoopInstruction | AddxInstruction;

function parseInput(input: string): number[] {
  const instructions: Instruction[] = input.split('\n').map((line) => {
    const [type, value] = line.split(' ');

    switch (type) {
      case 'noop': {
        return {
          type: 'noop',
        };
      }
      case 'addx': {
        return {
          type: 'addx',
          value: parseInt(value, 10),
        };
      }
      default: {
        throw new Error(`Unknown instruction type: ${type}`);
      }
    }
  });

  const clockData = new Array<number>();
  for (const instruction of instructions) {
    const lastValue = clockData[clockData.length - 1] || 0;
    if (instruction.type === 'noop') {
      clockData.push(lastValue);
    }
    if (instruction.type === 'addx') {
      clockData.push(lastValue, lastValue + instruction.value);
    }
  }

  return clockData;
}

type ParsedInput = ReturnType<typeof parseInput>;

function solve1(inputData: ParsedInput) {
  let sum = 0;
  for (let i = 19; i < inputData.length; i += 40) {
    sum += (inputData[i] ?? 0) * (i + 1);
  }

  return sum;
}

// currentX is between -1 and 39
// stepCount is between 1 and 240
function shouldDisplayPixel(cycle: number, spriteX: number) {
  const rowPositionToDisplay = cycle % 40;

  const val = Math.abs(spriteX - rowPositionToDisplay);

  return val <= 2;
}

function solve2(inputData: ParsedInput) {
  let x = 1;
  const display = new Array<Array<string>>();
  display.push(['#']);

  for (let i = 0; i < 240; i += 1) {
    const row = display[display.length - 1];
    const spriteX = inputData[i];

    const shouldDisplay = Math.abs(spriteX - (i % 40)) < 2;

    row.push(shouldDisplay ? '#' : '.');

    if (row.length === 41) {
      display.push(['#']);
    }
  }

  return display.map((row) => row.join('')).join('\n');
}

describe('day 10', () => {
  describe('test input', () => {
    let inputData: ParsedInput;

    beforeAll(() => {
      const input = fs
        .readFileSync(path.join(__dirname, 'input-test.txt'), 'utf-8')
        .trimEnd();

      inputData = parseInput(input);
    });

    // TODO fix these tests
    it('solves the first problem', () => {
      const result = solve1(inputData);
      console.log(result);
      // expect(result).toBe(13140);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);

      console.log(result);
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
      console.log('Second solution:');
      console.log(result);
    });
  });
});
