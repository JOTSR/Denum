import { assertEquals, assertThrows } from '../deps.ts';
import { gcd } from './gcd.ts';
import { factors } from './factors.ts';

Deno.test({
    name: 'It should return the greatest common denominator between two values',
    fn: () => {
        //number
        const primes: number[] = [];

        while (primes.length < 5) {
            const randInt = Math.round(Math.random() * 1e7);
            if ([...factors(randInt).keys()].length === 1) { //prime test
                primes.push(randInt);
            }
        }

        const [_gcd, a, b, c, d] = primes;

        assertEquals(gcd(a * _gcd, b * _gcd, c * _gcd, d * _gcd), _gcd);

        //bigint
        const bigPrimes: bigint[] = [];

        while (bigPrimes.length < 5) {
            const randInt = BigInt(Math.round(Math.random() * 1e7));
            if ([...factors(randInt).keys()].length === 1) { //prime test
                bigPrimes.push(randInt);
            }
        }

        const [_gcdN, aN, bN, cN, dN] = bigPrimes;

        assertEquals(
            gcd(aN * _gcdN, bN * _gcdN, cN * _gcdN, dN * _gcdN),
            _gcdN,
        );
    },
});

Deno.test({
    name: 'It should throw a range error',
    fn: () => {
        const a = -Math.round(Math.random() * 1e7);
        const b = Math.round(Math.random() * 1e7) - 5e6;
        //number
        assertThrows(
            () => gcd(a, b),
            RangeError,
            'Only positive number allowed',
        );
        //bigint
        assertThrows(
            () => gcd(BigInt(a), BigInt(b)),
            RangeError,
            'Only positive number allowed',
        );
    },
});

Deno.test({
    name: 'It should throw a type error',
    fn: () => {
        const a = Math.random() * 1e7;
        const b = Math.random() * 1e7;

        assertThrows(() => gcd(a, b), TypeError, 'Only integer number allowed');
    },
});
