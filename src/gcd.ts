/**
 * It takes two or more numbers and returns the greatest common divisor of all of them
 * @param {number | bigint} a - The first number to calculate the greatest common divisor for
 * @param {number | bigint} b - The second number to calculate the greatest common divisor for
 * @param {(number | bigint)[]} c - Other numbers to take into account
 * @returns {number | bigint} The greatest common divisor of the given numbers.
 */
export function gcd<T extends number | bigint>(a: T, b: T, ...c: T[]): T {
  if (a < 0 || b < 0) {
    throw new RangeError(`Only positive number allowed: (${a}, ${b})`);
  }
  if (
    (typeof a !== 'bigint' && !Number.isInteger(a)) ||
    (typeof b !== 'bigint' && !Number.isInteger(b))
  ) {
    throw new TypeError(`Only integer number allowed: (${a}, ${b})`);
  }

  let r = (a % b) as T;
  while (r > 0) {
    const _r = (b % r) as T;
    b = r;
    r = _r;
  }

  if (c.length === 0) return b;

  return gcd(b, c[0], ...c.slice(1));
}
