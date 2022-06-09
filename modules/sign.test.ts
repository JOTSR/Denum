import { assertEquals } from '../deps.ts';
import { sign } from './sign.ts';
import { randomInt } from './random.ts';

Deno.test({
    name: 'It should return the sign of the value',
    fn: () => {
        //number
        assertEquals(sign(Math.random() * Number.MAX_SAFE_INTEGER), 1);
        assertEquals(sign(Math.random() * Number.MIN_SAFE_INTEGER), -1);
        //bigint
        assertEquals(sign(randomInt(0n, 10n ** 10n)), 1n);
        assertEquals(sign(-randomInt(1n, 10n ** 10n)), -1n);
    },
});
