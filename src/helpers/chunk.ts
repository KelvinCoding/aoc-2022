import type { FixedLengthArray } from 'type-fest';

export function chunkArr<T, TSize extends number = number>(
  arr: T[],
  size: TSize
): FixedLengthArray<Array<T>, TSize> {
  const chunkedArr = new Array<Array<T>>();
  let index = 0;

  while (index < arr.length) {
    chunkedArr.push(arr.slice(index, size + index));
    index += size;
  }

  return Object.freeze(chunkedArr) as FixedLengthArray<Array<T>, TSize>;
}
