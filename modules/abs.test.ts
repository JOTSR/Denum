import { assertEquals } from '../deps.ts';
import { abs } from './abs.ts';

Deno.test({
    name: 'It should return the absolute value of a number',
    fn: () => {
        const randoms = new Array(100).fill(1).map((_) =>
            Math.random() * 1e4 - 5e3
        );
        const randomsInt = new Array(100).fill(1).map((_) =>
            BigInt(
                `0b${
                    (10000n).toString(2).split('').map((b) =>
                        Math.random() > Math.random() ? b : '0'
                    ).join('')
                }`,
            ) - 10000n
        );

        for (const random of randoms) {
            assertEquals(
                Math.abs(random),
                abs(random),
                `${abs(random)} is not the absolute of ${random}`,
            );
        }
        for (const randomInt of randomsInt) {
            assertEquals(
                randomInt < 0 ? -randomInt : randomInt,
                abs(randomInt),
                `${abs(randomInt)} is not the absolute of ${randomInt}`,
            );
        }
    },
});
