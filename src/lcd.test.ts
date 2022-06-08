import { assertEquals, assertThrows } from "../deps.ts";
import { lcd } from "./lcd.ts";
import { gcd, randomIntArray } from "../mod.ts";

Deno.test({
  name: "It should return the least common multiple between values",
  fn: () => {
    //number
    const values = randomIntArray(1, 100, 5);

    const _lcd = values.reduce((p, c) => (p * c) / gcd(p, c), 1);

    assertEquals(lcd(...values), _lcd);

    //bigint
    const valuesN = randomIntArray(0n, 10_000n, 5);

    const _lcdN = valuesN.reduce((p, c) => (p * c) / gcd(p, c), 1n);

    assertEquals(lcd(...valuesN), _lcdN);
  },
});

Deno.test({
  name: "It should throw a range error",
  fn: () => {
    const a = -Math.round(Math.random() * 1e7);
    const b = Math.round(Math.random() * 1e7) - 5e6;
    //number
    assertThrows(() => lcd(a, b), RangeError, "Only positive number allowed");
    //bigint
    assertThrows(
      () => lcd(BigInt(a), BigInt(b)),
      RangeError,
      "Only positive number allowed",
    );
  },
});

Deno.test({
  name: "It should throw a type error",
  fn: () => {
    const a = Math.random() * 1e7;
    const b = Math.random() * 1e7;

    assertThrows(() => lcd(a, b), TypeError, "Only integer number allowed");
  },
});
