import { assertEquals } from '../deps.ts';
import { irange, range } from './range.ts';

Deno.test({
    name: 'It should return an array build on specified range',
    fn: () => {
        //Static asserts
        assertEquals(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            range(0, 10),
            'Integer increase',
        );
        assertEquals(
            [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
            range(10, 0),
            'Integer decrease',
        );
        assertEquals(
            [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n],
            range(0n, 10n),
            'BigInt increase',
        );
        assertEquals(
            [10n, 9n, 8n, 7n, 6n, 5n, 4n, 3n, 2n, 1n, 0n],
            range(10n, 0n),
            'BigInt decrease',
        );
        //Dynamic asserts
        const [start, step, length] = [
            Math.random() * 100 - 50,
            Math.random() * 10 - 5,
            Math.round(Math.random() * 100) + 1,
        ];
        const randomArray = new Array(length).fill(1).map((_, index) =>
            start + index * step
        );
        assertEquals(
            randomArray,
            range(start, randomArray.at(-1) ?? 0, step),
            'Random reals',
        );
    },
});

Deno.test({
    name: 'It should iterate on specified range',
    fn: () => {
        //Static asserts
        assertEquals(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [...irange(0, 10)],
            'Integer increase',
        );
        assertEquals(
            [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
            [...irange(10, 0)],
            'Integer decrease',
        );
        assertEquals([0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n], [
            ...irange(0n, 10n),
        ], 'BigInt increase');
        assertEquals([10n, 9n, 8n, 7n, 6n, 5n, 4n, 3n, 2n, 1n, 0n], [
            ...irange(10n, 0n),
        ], 'BigInt decrease');
        //Dynamic asserts
        const [start, step, length] = [
            Math.random() * 100 - 50,
            Math.random() * 10 - 5,
            Math.round(Math.random() * 50),
        ];
        const randomArray = new Array(length).fill(1).map((_, index) =>
            start + index * step
        );
        //Random reals
        assertEquals(
            [...irange(start, randomArray.at(-1) ?? 0, step)]
                .map((value, index) =>
                    Math.round((value - randomArray[index]) * 10e10) / 10e10
                )
                .filter((number) => !Number.isNaN(number))
                .reduce((prev, curr) => prev + curr),
            0,
            `Random reals`,
        );
    },
});
