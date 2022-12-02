import { beforeAll, describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

function solve1(lines: string[]): number {
  let top = 0;

  const lineLength = lines.length;
  let index = 0;
  while (index < lineLength) {
    let line = lines[index];
    let currentCalories = 0;
    while (line) {
      const calories = parseInt(line, 10);
      currentCalories += calories;

      index += 1;
      line = lines[index];
    }

    if (currentCalories > top) {
      top = currentCalories;
    }

    index += 1;
  }

  return top;
}

function solve2(lines: string[]): number {
  // pseudo heap sort
  // Left most value is largest
  let top3 = [0, 0, 0];

  const addToTop3 = (calories: number) => {
    const [a, b, c] = top3;
    if (calories > a) {
      top3 = [calories, a, b];
    } else if (calories > b) {
      top3 = [a, calories, b];
    } else if (calories > c) {
      top3 = [a, b, calories];
    }
  };

  const lineLength = lines.length;
  let index = 0;
  while (index < lineLength) {
    let line = lines[index];
    let currentCalories = 0;
    while (line) {
      const calories = parseInt(line, 10);
      currentCalories += calories;

      index += 1;
      line = lines[index];
    }

    addToTop3(currentCalories);

    index += 1;
  }

  const sum = top3.reduce((sum, calories) => sum + calories, 0);

  return sum;
}

describe("day 01", () => {
  describe("test input", () => {
    let lines: string[];

    beforeAll(() => {
      const input = fs.readFileSync(
        path.join(__dirname, "input-test.txt"),
        "utf-8"
      );
      lines = input.split("\n");
    });

    it("solves the first problem", () => {
      const top = solve1(lines);
      expect(top).toBe(24000);
    });

    it("solves the second problem", () => {
      const sum = solve2(lines);
      expect(sum).toBe(45000);
    });
  });

  describe("actual input", () => {
    let lines: string[];

    beforeAll(() => {
      const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8");
      lines = input.split("\n");
    });

    describe("original, imperative", () => {
      it("solves the first problem", () => {
        const top = solve1(lines);
        console.log("First solution:", top);
      });

      it("solves the second problem", () => {
        const sum = solve2(lines);
        console.log("Second solution:", sum);
      });
    });

    describe("functional refactor", () => {
      let elfCalories: number[];

      beforeAll(() => {
        elfCalories = lines.reduce(
          (elves, line) => {
            if (!line) {
              elves.push(0);
              return elves;
            }

            const calories = parseInt(line, 10);
            elves[elves.length - 1] += calories;

            return elves;
          },
          [0] as number[]
        );
      });

      it("solves the first problem", () => {
        const top = elfCalories.reduce(
          (top, calories) => Math.max(top, calories),
          0
        );

        console.log("First solution:", top);
      });

      it("solves the second problem", () => {
        const top3 = elfCalories
          .sort((a, b) => b - a)
          .slice(0, 3)
          .reduce((sum, calories) => sum + calories, 0);

        console.log("Second solution:", top3);
      });
    });
  });
});
