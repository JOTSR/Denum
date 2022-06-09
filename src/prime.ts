import { factors } from '../mod.ts';

/**
 * Test if a given number is prime or not
 * Warning: O(n) algorithm
 * @param {number | bigint} int - The number to check if it's prime
 * @returns Check result
 */
export function isPrime<T extends number | bigint>(int: T): boolean {
  //TODO implement AKS prime test
  const result = factors(int);
  return [...result.keys()].length === 1 && result.get(int) == 1;
}

/**
 * It returns an array of prime numbers of the specified quantity
 * Warning: bounds are excluded
 * @param {number | bigint} quantity - The amount of prime numbers you want to get
 * @returns An array of prime numbers
 */
export function getPrimes<T extends number | bigint>(quantity: T): T[];

/**
 * It returns an array of prime numbers between a minimum and maximum value
 * Warning: bounds are excluded
 * @param {number | bigint} min - The minimum number to start from
 * @param {number | bigint} max - The maximum number to check for primality
 * @returns An array of prime numbers
 */
export function getPrimes<T extends number | bigint>(min: T, max: T): T[];
export function getPrimes<T extends number | bigint>(...args: T[]): T[] {
  const array: T[] = [];

  if (args.length === 2) {
    let [counter, max] = args;

    while (counter < max) {
      if (isPrime(counter)) {
        //@ts-ignore type already checked
        array.push(counter);
      }
      counter++;
    }
  }

  if (args.length === 1) {
    const quantity = args[0];
    let counter = (typeof quantity === 'number') ? 2 : 2n;

    while (array.length < quantity) {
      if (isPrime(counter)) {
        //@ts-ignore type already checked
        array.push(counter);
      }
      counter++;
    }
  }

  return array;
}
