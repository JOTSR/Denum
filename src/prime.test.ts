import { assertEquals } from "../deps.ts";
import { randomInt, randomIntArray } from "../mod.ts";
import { getPrimes, isPrime } from "./prime.ts";

Deno.test({
  name: "It should check if a value is prime or not",
  fn: () => {
    //number
    const range = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const primes = [2, 3, 5, 7, 11, 13];
    assertEquals(range.filter((v) => isPrime(v)), primes);
    //bigint
    const rangeN = [
      2n,
      3n,
      4n,
      5n,
      6n,
      7n,
      8n,
      9n,
      10n,
      11n,
      12n,
      13n,
      14n,
      15n,
    ];
    const primesN = [2n, 3n, 5n, 7n, 11n, 13n];
    assertEquals(rangeN.filter((v) => isPrime(v)), primesN);
  },
});

Deno.test({
  name: "It should return an array of prime number between two values",
  fn: () => {
    //number
    const [min, max] = randomIntArray(0, 1e4, 2);
    const primes = getPrimes(min, max);
    assertEquals(primes.every((prime) => isPrime(prime)), true);
    //bigint
    const [minN, maxN] = randomIntArray(0n, 1_000n, 2);
    const primesN = getPrimes(minN, maxN);
    assertEquals(primesN.every((prime) => isPrime(prime)), true);
  },
});

Deno.test({
  name: "It should return an array of n prime number",
  fn: () => {
    //number
    const quantity = randomInt(0, 40);
    const primes = getPrimes(quantity);
    assertEquals(primes.length, quantity);
    assertEquals(primes.every((prime) => isPrime(prime)), true);
    //bigint
    const quantityN = randomInt(0n, 40n);
    const primesN = getPrimes(quantityN);
    assertEquals(primesN.length, Number(quantityN));
    assertEquals(primesN.every((prime) => isPrime(prime)), true);
  },
});
