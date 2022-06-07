import { assertEquals, assertThrows } from '../deps.ts';
import { factors } from './factors.ts';

Deno.test({
  name: 'It should factorize the float',
  fn: () => {
    //number
    const primeFactor = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    const primeArray = primeFactor
      .filter((_) => Math.random() > 0.5)
      //.flatMap(p => Array(Math.round(Math.random() * 10 + 1)).fill(p)) //to high numbers
      .sort();

    const product = primeArray.reduce((p, c) => p * c, 1);

    const resultMap = factors(product);
    const resultArray = [...resultMap.keys()]
      .flatMap((k) => Array(resultMap.get(k)).fill(k))
      .sort();

    assertEquals(primeArray, resultArray);

    //bigint
    const bigPrimeFactor = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];
    const bigPrimeArray = bigPrimeFactor
      .filter((_) => Math.random() > 0.5)
      .flatMap((p) => Array(Math.round(Math.random() * 10 + 1)).fill(p))
      .sort();

    const bigProduct = bigPrimeArray.reduce((p, c) => p * c, 1n);

    const bigResultMap = factors(bigProduct);
    const bigResultArray = [...bigResultMap.keys()]
      .flatMap((k) => Array(Number(bigResultMap.get(k))).fill(k))
      .sort();

    assertEquals(bigPrimeArray, bigResultArray);
  },
});

Deno.test({
  name: 'It should throw a type error',
  fn: () => {
    assertThrows(
      () => factors(Math.random() * 1e8), //>1e8 too long
      TypeError,
      'Only integer number allowed',
    );

    assertThrows(
      () => factors(Math.random() * 1e8), //>1e8 too long
      TypeError,
      'Only integer number allowed',
    );
  },
});
