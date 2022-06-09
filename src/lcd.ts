import { gcd } from '../mod.ts';

/**
 * The least common denominator of a set of numbers is the smallest number that is a multiple of all the
 * numbers in the set
 * @param {(number | bigint)[]} n - The numbers to find the LCD of.
 * @returns The least common multiple of the numbers in the array.
 */
export function lcd<T extends number | bigint>(...n: T[]): T {
  const [a, b, ...c] = n;
  if (a < 0 || b < 0) {
    throw new RangeError(`Only positive number allowed: (${a}, ${b})`);
  }
  if (
    (typeof a !== 'bigint' && !Number.isInteger(a)) ||
    (typeof b !== 'bigint' && !Number.isInteger(b))
  ) {
    throw new TypeError(`Only integer number allowed: (${a}, ${b})`);
  }
  const r = (a * b) / gcd(a, b) as T;
  return (c.length === 0) ? r : lcd(r, ...c);
}
