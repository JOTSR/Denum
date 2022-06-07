import { assertEquals } from './deps.ts';
import { map } from './map.ts';
import { randomIntArray } from './random.ts';

Deno.test({
  name: 'It should re-map a value from given bounds to another bounds',
  fn: () => {
    //Number
    const destinationBounds = [
      Math.random() * 1e5 - 5e4,
      Math.random() * 1e5 - 5e4,
    ].sort((a, b) => a - b) as [number, number];
    const randomValues = new Array(100).fill(1).map((_) =>
      Math.random() * 1e5 - 5e4
    );
    const initialBounds = [Math.min(...randomValues), Math.max(...randomValues)]
      .sort((a, b) => a - b) as [number, number];
    const remappedValues = randomValues.map((value) =>
      (value - initialBounds[0]) *
        (destinationBounds[1] - destinationBounds[0]) /
        (initialBounds[1] - initialBounds[0]) + destinationBounds[0]
    );
    assertEquals(
      remappedValues.map((value) => value.toFixed(4)),
      randomValues.map((value) => map(value, initialBounds, destinationBounds))
        .map((value) => value.toFixed(4)),
      `Remap a random array of number from [${initialBounds.join(', ')}] to [${
        destinationBounds.join(', ')
      }]`,
    );
    //BigInt
    const bigDestinationBounds = randomIntArray(-(10n ** 5n), 10n ** 5n, 2)
      .sort((a, b) => a < b ? -1 : 1) as [bigint, bigint];
    const bigRandomValues = randomIntArray(-(10n ** 5n), 10n ** 5n, 5);
    const bigInitialBounds = [
      bigRandomValues.sort((a, b) => a < b ? -1 : 1).at(0) ?? 0n,
      bigRandomValues.sort((a, b) => a < b ? -1 : 1).at(-1) ?? 1n,
    ] as [bigint, bigint];
    const bigRemappedValues = bigRandomValues.map((bigValue) =>
      (bigValue - bigInitialBounds[0]) *
        (bigDestinationBounds[1] - bigDestinationBounds[0]) /
        (bigInitialBounds[1] - bigInitialBounds[0]) + bigDestinationBounds[0]
    );
    assertEquals(
      bigRemappedValues,
      bigRandomValues.map((bigValue) =>
        map(bigValue, bigInitialBounds, bigDestinationBounds)
      ),
      `Remap a random array of bigint from [${
        bigInitialBounds.join(', ')
      }] to [${bigDestinationBounds.join(', ')}]`,
    );
  },
});
