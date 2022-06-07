import { abs } from './abs.ts';

/**
 * It takes a number and returns a map of the prime factors of that number and the number of times they occur
 * @param {T} n - The number to factorize
 * @returns A Map of factors and their count.
 */
export function factors<T extends number | bigint>(n: T): Map<T, T> {
  if (typeof n !== 'bigint' && !Number.isInteger(n)) {
    throw new TypeError(`Only integer number allowed: (${n})`);
  }
  //@ts-ignore same types
  let value = abs(n);
  const factors: Map<T, T> = new Map();
  let _factors: T[] = [];
  let factor = ((typeof value === 'bigint') ? 2n : 2) as T;

  do {
    if (value % factor == 0) {
      _factors.push(factor);
      factors.set(
        _factors[0],
        ((typeof value === 'bigint')
          ? BigInt(_factors.length)
          : _factors.length) as T,
      );
      //@ts-ignore same type values
      value /= factor;
    } else {
      if (_factors.length !== 0) _factors = [];
      factor++;
    }
  } while (value > 1);

  return factors;
}
