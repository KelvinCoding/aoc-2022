import { beforeAll, describe, it } from "vitest";
import fs from "fs";
import path from "path";

describe("day 01", () => {
  let lines: string[];
  beforeAll(() => {
    const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8");
    lines = input.split("\n");
  });

  describe("original, imperative", () => {
    it("solves the first problem", () => {
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

      console.log("First solution:", top);
    });

    it("solves the second problem", () => {
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

      console.log(
        "Second solution:",
        top3.reduce((sum, calories) => sum + calories, 0)
      );
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
