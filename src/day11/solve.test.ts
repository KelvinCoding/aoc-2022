import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

type Monkey = {
  num: number;
  items: number[];
  operation: (old: number) => number;
  testFn: (num: number) => number;
  testNum: number;
};

function cloneMonkey(monkey: Monkey): Monkey {
  return {
    ...monkey,
    items: [...monkey.items],
  };
}

function parseOp(opStr: string): (num: number) => number {
  const [output, eq, item1, op, item2] = opStr.split(':')[1].trim().split(' ');

  const item1Num = parseInt(item1, 10);
  const item2Num = parseInt(item2, 10);

  const isMultiply = op === '*';

  if (isMultiply) {
    return (num: number) => {
      const left = Number.isNaN(item1Num) ? num : item1Num;
      const right = Number.isNaN(item2Num) ? num : item2Num;

      return left * right;
    };
  }

  return (num: number) => {
    const left = Number.isNaN(item1Num) ? num : item1Num;
    const right = Number.isNaN(item2Num) ? num : item2Num;

    return left + right;
  };
}

function parseTest(
  testStr: string,
  trueCond: string,
  falseCond: string
): [number, (num: number) => number] {
  const [_, testNum] = testStr.split('by');
  const test = parseInt(testNum, 10);

  const trueCondition = parseInt(trueCond.split('monkey')[1].trim());
  const falseCondition = parseInt(falseCond.split('monkey')[1].trim());

  const fn = (num: number) => {
    if (num % test === 0) {
      return trueCondition;
    }

    return falseCondition;
  };

  return [test, fn];
}

function parseMonkey(monkey: string): Monkey {
  const [monkeyData, startingStr, opStr, testStr, trueStr, falseStr] = monkey
    .split('\n')
    .map((l) => l.trim());

  const num = parseInt(monkeyData.split(' ')[1].split(':')[0], 10);
  const items = startingStr
    .split(':')[1]
    .trim()
    .split(',')
    .map((s) => parseInt(s, 10));
  const op = parseOp(opStr);
  const [testNum, testFn] = parseTest(testStr, trueStr, falseStr);

  const monke: Monkey = {
    num,
    items: items,
    operation: op,
    testFn,
    testNum,
  };

  return monke;
}

function parseInput(input: string) {
  const monkeyStr = input.split('\n\n');

  const monkeys = monkeyStr.map(parseMonkey);

  return monkeys;
}

type ParsedInput = ReturnType<typeof parseInput>;

function solve1(inputData: ParsedInput) {
  const monkeys = inputData.map((monkey) => cloneMonkey(monkey));
  const inspectCount = Array.from({ length: monkeys.length }, () => 0);

  for (let round = 0; round < 20; round += 1) {
    for (let i = 0; i < monkeys.length; i += 1) {
      const startingMonkey = monkeys[i];

      let stressLevel: number = startingMonkey.items.shift();
      while (stressLevel !== undefined) {
        inspectCount[i] += 1;

        stressLevel = startingMonkey.operation(stressLevel);
        stressLevel = Math.floor(stressLevel / 3);

        const nextMonkey = startingMonkey.testFn(stressLevel);
        monkeys[nextMonkey].items.push(stressLevel);

        stressLevel = startingMonkey.items.shift();
      }
    }
  }

  const [max1, max2] = inspectCount.reduce(
    ([maxA, maxB], curr) => {
      if (curr > maxA) {
        return [curr, maxA];
      }

      if (curr > maxB) {
        return [maxA, curr];
      }

      return [maxA, maxB];
    },
    [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  return max1 * max2;
}

function solve2(inputData: ParsedInput) {
  const monkeys = inputData.map((monkey) => cloneMonkey(monkey));
  const inspectCount = Array.from({ length: monkeys.length }, () => 0);
  const monkeyMod = monkeys.reduce((prod, monkey) => prod * monkey.testNum, 1);

  for (let round = 0; round < 10000; round += 1) {
    for (let i = 0; i < monkeys.length; i += 1) {
      const startingMonkey = monkeys[i];

      while (startingMonkey.items.length) {
        inspectCount[i] += 1;
        const startingStress: number = startingMonkey.items.shift();

        const nextStress = startingMonkey.operation(startingStress) % monkeyMod;

        const nextMonkey = startingMonkey.testFn(nextStress);
        monkeys[nextMonkey].items.push(nextStress);
      }
    }
  }

  const [max1, max2] = inspectCount.reduce(
    ([maxA, maxB], curr) => {
      if (curr > maxA) {
        return [curr, maxA];
      }

      if (curr > maxB) {
        return [maxA, curr];
      }

      return [maxA, maxB];
    },
    [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  return max1 * max2;
}

describe.only('day 11', () => {
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
      expect(result).toBe(10605);
    });

    it('solves the second problem', () => {
      const result = solve2(inputData);
      expect(result).toBe(2713310158);
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
