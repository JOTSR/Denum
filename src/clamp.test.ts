import { assertEquals } from '../deps.ts';
import { clamp } from './clamp.ts';

Deno.test({
  name: 'It should return clamp values',
  fn: () => {
    //Number
    const min = Math.random() * 100 - 50;
    const max = Math.random() * 100 + min;
    const values = new Array(100).fill(1).map((_) => Math.random() * 200 - 100);
    const clampedValues = values.map((value) =>
      value > max ? max : value < min ? min : value
    );
    assertEquals(
      clampedValues,
      values.map((value) => clamp(value, min, max)),
      'Clamp typeof number',
    );
    //BigInt
    const bigMin = BigInt(Math.round(Math.random() * 1e5 - 5e4));
    const bigMax = BigInt(Math.round(Math.random() * 1e5)) + bigMin;
    const bigValues = new Array(100).fill(1).map((_) =>
      BigInt(Math.round(Math.random() * 2e5 - 1e5))
    );
    const bigClampedValues = bigValues.map((bigValue) =>
      bigValue > bigMax ? bigMax : bigValue < bigMin ? bigMin : bigValue
    );
    assertEquals(
      bigClampedValues,
      bigValues.map((bigValue) => clamp(bigValue, bigMin, bigMax)),
      'Clamp typeof bigint',
    );
  },
});
