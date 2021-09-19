import { assertEquals } from './deps.ts';
import { round } from './round.ts';

Deno.test({
  name: 'It should round the given number following user parameter',
  fn: () => {
    const rand = [
      Math.random() * 10e5,
      Math.random() * 10e5,
      Math.random() * 10e5,
      Math.random() * 10e5,
    ];
    const decimals = Math.round(Math.random() * 9) + 1;
    const power = 10 ** decimals;
    assertEquals(Math.round(rand[0]), round(rand[0]), `Default parameters`);
    assertEquals(
      Math.round(rand[1] * power) / power,
      round(rand[1], decimals),
      `Nearest @ ${decimals} decimals`,
    );
    assertEquals(
      Math.ceil(rand[2] * power) / power,
      round(rand[2], decimals, 'ceil'),
      `Ceil @ ${decimals} decimals`,
    );
    assertEquals(
      Math.floor(rand[3] * power) / power,
      round(rand[3], decimals, 'floor'),
      `Floor @ ${decimals} decimals`,
    );
  },
});
