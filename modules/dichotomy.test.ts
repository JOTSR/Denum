import { assertEquals, assertThrows } from '../deps.ts';
import { dichotomy } from './dichotomy.ts';

Deno.test({
    name: 'It should resolve the equations',
    fn: () => {
        assertEquals(dichotomy('3 * $x', 8), 2.666666666666667);
        assertEquals(
            dichotomy('- ($x ** 2) + 20', 0, 'x', { min: 0 }),
            4.472135954999579,
        );
        assertEquals(
            dichotomy('- ($x ** 2) + 20', 0, 'x', { max: 0 }),
            -4.472135954999579,
        );
        assertEquals(
            dichotomy('$x ** 2 + $cst', 16, 'x', {
                min: 0,
                max: 10,
                precision: 2,
                constants: new Map().set('cst', 7),
            }),
            3,
        );
        assertEquals(
            dichotomy('Math.cos(2 * $x) + 5', 5, 'x', { min: 0, max: Math.PI }),
            2.356194490192345,
        );
    },
});

Deno.test({
    name: 'It should throw a type error',
    fn: () => {
        assertThrows(
            () => dichotomy('$x', 0, 'x', { precision: Math.random() }),
            TypeError,
            'Precision must be an int',
        );
    },
});

Deno.test({
    name: 'It should throw a range error',
    fn: () => {
        assertThrows(
            () =>
                dichotomy('$x', 0, 'x', {
                    precision: Math.round(16 + Math.random() * 100),
                }),
            RangeError,
            'Exceed float32 precision',
        );
        assertThrows(
            () =>
                dichotomy('$x', 0, 'x', {
                    precision: Math.round(-1 - Math.random() * 100),
                }),
            RangeError,
            'Exceed float32 precision',
        );
    },
});

Deno.test({
    name: 'It should throw a convergence error',
    fn: () => {
        assertThrows(() => dichotomy('1', 0), Error, 'Unable to converge');
    },
});
