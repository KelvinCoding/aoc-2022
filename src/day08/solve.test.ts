import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function parseInput(input: string) {
  const grid = input
    .split('\n')
    .map((line) => line.split('').map((c) => parseInt(c, 10)));

  return grid;
}

type ParsedInput = ReturnType<typeof parseInput>;

function countVisible(gridHeights: number[][]) {
  const yLen = gridHeights.length;
  const xLen = gridHeights[0].length;

  // From Top to bottom
  const visiblePositions = new Set<string>();

  let currentMaxHeight = Number.MIN_SAFE_INTEGER;

  // from Top to Bottom
  for (let x = 0; x < xLen; x++) {
    for (let y = 0; y < yLen; y++) {
      const height = gridHeights[y][x];
      if (height > currentMaxHeight) {
        visiblePositions.add(`${x},${y}`);
        currentMaxHeight = height;
      }
    }
    currentMaxHeight = Number.MIN_SAFE_INTEGER;
  }

  // from Bottom to Top
  currentMaxHeight = Number.MIN_SAFE_INTEGER;
  for (let x = 0; x < xLen; x++) {
    for (let y = yLen - 1; y > 0; y--) {
      const height = gridHeights[y][x];
      if (height > currentMaxHeight) {
        visiblePositions.add(`${x},${y}`);
        currentMaxHeight = height;
      }
    }
    currentMaxHeight = Number.MIN_SAFE_INTEGER;
  }

  // from Left to Right
  currentMaxHeight = Number.MIN_SAFE_INTEGER;
  for (let y = 0; y < yLen; y++) {
    for (let x = 0; x < xLen; x++) {
      const height = gridHeights[y][x];
      if (height > currentMaxHeight) {
        visiblePositions.add(`${x},${y}`);
        currentMaxHeight = height;
      }
    }
    currentMaxHeight = Number.MIN_SAFE_INTEGER;
  }

  // from Right to Left
  currentMaxHeight = Number.MIN_SAFE_INTEGER;
  for (let y = 0; y < yLen; y++) {
    for (let x = xLen - 1; x > 0; x--) {
      const height = gridHeights[y][x];
      if (height > currentMaxHeight) {
        visiblePositions.add(`${x},${y}`);
        currentMaxHeight = height;
      }
    }
    currentMaxHeight = Number.MIN_SAFE_INTEGER;
  }

  // console.log(visiblePositions);

  // const display = Array.from({ length: yLen + 1 }, () =>
  //   Array.from({ length: xLen + 1 }, () => ' ')
  // );

  // visiblePositions.forEach((pos) => {
  //   const [x, y] = pos.split(',').map((n) => parseInt(n, 10));
  //   display[y][x] = '#';
  // });

  // console.log(display.map((row) => row.join('')).join('\n'));

  return visiblePositions.size;
}

function solve1(inputData: ParsedInput) {
  return countVisible(inputData);
}

interface VisibleFromPosition {
  left: number;
  right: number;
  up: number;
  down: number;
}

function countVisibleFromPosition(
  gridHeights: number[][],
  posX: number,
  posY: number
) {
  const visibleCount = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  };

  const positionHeight = gridHeights[posY][posX];

  // Left
  for (let x = posX - 1; x >= 0; x--) {
    const height = gridHeights[posY][x];
    visibleCount.left += 1;

    if (height >= positionHeight) {
      break;
    }
  }

  // Right
  for (let x = posX + 1; x < gridHeights[0].length; x++) {
    const height = gridHeights[posY][x];
    visibleCount.right += 1;
    if (height >= positionHeight) {
      break;
    }
  }

  // Up
  for (let y = posY - 1; y >= 0; y--) {
    const height = gridHeights[y][posX];
    visibleCount.up += 1;
    if (height >= positionHeight) {
      break;
    }
  }

  // Down
  for (let y = posY + 1; y < gridHeights.length; y++) {
    const height = gridHeights[y][posX];
    visibleCount.down += 1;
    if (height >= positionHeight) {
      break;
    }
  }

  return visibleCount;
}

function calculateScenicScore(visible: VisibleFromPosition) {
  return visible.left * visible.right * visible.up * visible.down;
}

function solve2(inputData: ParsedInput) {
  const yLen = inputData.length;
  const xLen = inputData[0].length;

  let maxScore = Number.MIN_SAFE_INTEGER;

  for (let x = 1; x < xLen - 1; x++) {
    for (let y = 1; y < yLen - 1; y++) {
      const visible = countVisibleFromPosition(inputData, x, y);
      const score = calculateScenicScore(visible);
      if (score > maxScore) {
        maxScore = score;
      }
    }
  }

  return maxScore;
}

describe('day 08', () => {
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
      expect(result).toBe(21);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);
      expect(result).toBe(8);
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
