/**
 * Generate a bounded random number
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {number} Random number
 */
export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a bounded random integer
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min: number, max: number): number;
/**
 * Generate a bounded random integer
 * @param {bigint} min Minimum value
 * @param {bigint} max Maximum value
 * @returns {bigint} Random integer
 */
export function randomInt(min: bigint, max: bigint): bigint;
export function randomInt<T extends number | bigint>(
  min: T,
  max: T,
): T {
  //bigint
  if (typeof (min) == 'bigint' && typeof (max) == 'bigint') {
    return BigInt(
      `0b${
        (max - min - 1n).toString(2).split('').map((b) =>
          Math.random() > Math.random() ? b : '0'
        ).join('')
      }`,
    ) + min as T;
  }
  //Number
  if (typeof (min) == 'number' && typeof (max) == 'number') {
    return Math.round(Math.random() * (max - min) + min) as T;
  }
  throw new TypeError('Parameters must be of the same type');
}

/**
 * Produce an array filled with random values
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @param {number} length Array length
 * @returns {number[]} Random numbers array
 */
export function randomArray(min: number, max: number, length: number) {
  const array = new Array<number>(length).fill(1).map((_) => random(min, max));
  return array;
}

/**
 * Produce an array filled with random integers
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @param {number} length Array length
 * @returns {number[]} Random integers array
 */
export function randomIntArray(
  min: number,
  max: number,
  length: number,
): number[];
/**
 * Produce an array filled with random integers
 * @param {bigint} min Minimum value
 * @param {bigint} max Maximum value
 * @param {bigint} length Array length
 * @returns {bigint[]} Random integers array
 */
export function randomIntArray(
  min: bigint,
  max: bigint,
  length: number,
): bigint[];
export function randomIntArray<T extends number | bigint>(
  min: T,
  max: T,
  length: number,
) {
  if (typeof min === 'number' && typeof max === 'number') {
    //@ts-ignore type already checked
    const array = new Array<typeof min>(length).fill(1).map((_) =>
      randomInt(min, max)
    );
    return array as typeof min[];
  }
  if (typeof min === 'bigint' && typeof max === 'bigint') {
    //@ts-ignore type already checked
    const array = new Array<typeof min>(length).fill(1n).map((_) =>
      randomInt(min, max)
    );
    return array as typeof min[];
  }
  return [] as typeof min[];
}
