import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

type Direction = 'R' | 'L' | 'U' | 'D';
type Instruction = {
  direction: Direction;
  distance: number;
};

function parseInput(input: string): Instruction[] {
  return input.split('\n').flatMap((line) => {
    const [direction, distance] = line.split(' ');
    return {
      direction: direction as Direction,
      distance: parseInt(distance, 10),
    };
  });
}

type ParsedInput = ReturnType<typeof parseInput>;

type Position = { x: number; y: number };

function isTouching(a: Position, b: Position): boolean {
  return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;
}

function fixKnotPosition(head: Position, tail: Position) {
  if (isTouching(head, tail)) {
    return tail;
  }

  const { x: tx, y: ty } = tail;

  if (head.x === tail.x) {
    for (let dy = -1; dy <= 1; dy += 2) {
      const t = { x: tx, y: ty + dy };
      if (isTouching(head, t)) {
        return t;
      }
    }
  } else if (head.y === tail.y) {
    for (let dx = -1; dx <= 1; dx += 2) {
      const t = { x: tx + dx, y: ty };
      if (isTouching(head, t)) {
        return t;
      }
    }
  } else {
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        const t = { x: tx + dx, y: ty + dy };
        if (isTouching(head, t)) {
          return t;
        }
      }
    }
    throw new Error('never touched diag');
  }
  throw new Error('never touched');
}

function movePosition(
  rope: Position[],
  instruction: Instruction,
  visitedPositions: Set<string>
) {
  const { direction, distance } = instruction;

  for (let i = 0; i < distance; i++) {
    switch (direction) {
      case 'R':
        rope[0].x += 1;
        break;
      case 'L':
        rope[0].x -= 1;
        break;
      case 'U':
        rope[0].y += 1;
        break;
      case 'D':
        rope[0].y -= 1;
        break;
    }

    for (let len = 1; len < rope.length; len++) {
      rope[len] = fixKnotPosition(rope[len - 1], rope[len]);
    }

    const position = `${rope[rope.length - 1].x},${rope[rope.length - 1].y}`;
    visitedPositions.add(position);
  }
}

function solve1(inputData: ParsedInput) {
  const visitedPositions = new Set<string>();
  const rope: Position[] = Array.from({ length: 2 }, () => ({ x: 0, y: 0 }));

  for (const instruction of inputData) {
    movePosition(rope, instruction, visitedPositions);
  }

  return visitedPositions.size;
}

function solve2(inputData: ParsedInput) {
  const visitedPositions = new Set<string>();
  const rope: Position[] = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));

  for (const instruction of inputData) {
    movePosition(rope, instruction, visitedPositions);
  }

  return visitedPositions.size;
}

describe('day 09', () => {
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
      expect(result).toBe(88);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);
      expect(result).toBe(36);
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
