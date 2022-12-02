import { beforeAll, describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const opponentAction = {
  A: 'ROCK',
  B: 'PAPER',
  C: 'SCISSORS',
} as const;

const playerAction = {
  X: 'ROCK',
  Y: 'PAPER',
  Z: 'SCISSORS',
} as const;

const points = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
} as const;

type OpponentKey = keyof typeof opponentAction;
type PlayerKey = keyof typeof playerAction;
type RpsAction = keyof typeof points;

const winningAction = {
  // Opponent: Player
  ROCK: 'PAPER',
  PAPER: 'SCISSORS',
  SCISSORS: 'ROCK',
} as const;

const losingAction = {
  //Opponent: Player
  ROCK: 'SCISSORS',
  PAPER: 'ROCK',
  SCISSORS: 'PAPER',
} as const;

const todoMap = {
  X: 'LOSE',
  Y: 'DRAW',
  Z: 'WIN',
} as const;

function isWinner(playAction: RpsAction, oppAction: RpsAction): boolean {
  return winningAction[oppAction] === playAction;
}

function solve1(lines: string[]): number {
  let score = 0;
  for (const line of lines) {
    if (!line) {
      continue;
    }

    const [opp, play] = line.split(' ') as [OpponentKey, PlayerKey];
    const playAction = playerAction[play];
    const playPoints = points[playAction];

    score += playPoints;

    const oppAction = opponentAction[opp];

    if (isWinner(playAction, oppAction)) {
      score += 6;
    } else if (oppAction === playAction) {
      score += 3;
    }
  }
  return score;
}

function solve2(lines: string[]): number {
  let score = 0;
  for (const line of lines) {
    if (!line) {
      continue;
    }

    const [opp, todo] = line.split(' ') as [OpponentKey, PlayerKey];
    const todoAction = todoMap[todo];
    const oppAction = opponentAction[opp];

    let playAction: RpsAction;
    if (todoAction === 'WIN') {
      playAction = winningAction[oppAction];
    } else if (todoAction === 'LOSE') {
      playAction = losingAction[oppAction];
    } else {
      playAction = oppAction;
    }

    // const playAction = playerAction[play];
    const playPoints = points[playAction];

    score += playPoints;

    if (isWinner(playAction, oppAction)) {
      score += 6;
    } else if (oppAction === playAction) {
      score += 3;
    }
  }
  return score;
}

describe('day 02', () => {
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
      expect(result).toBe(15);
    });

    it('solves the second problem', () => {
      const result = solve2(lines);
      expect(result).toBe(12);
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
