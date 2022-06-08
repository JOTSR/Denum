/**
 * It takes two or more numbers and returns the greatest common divisor of all of them
 * @param {(number | bigint)[]} n - Numbers to calculate the greatest common divisor for
 * @returns {number | bigint} The greatest common divisor of the given numbers.
 */
export function gcd<T extends number | bigint>(...n: T[]): T {
  let [a, b, ...c] = n;

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

  return (c.length === 0) ? b : gcd(b, ...c);
}
