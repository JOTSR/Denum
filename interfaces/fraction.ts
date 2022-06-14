import { abs, gcd, sign } from '../mod.ts';
import { AbstractValue } from './value.ts';

export class Frac extends AbstractValue<Frac> {
    #num: bigint;
    #den: bigint;

    /**
     * The constructor function takes two arguments, `num` and `den`, and sets the numerator and
     * denominator of the rational number to the absolute value of `num` and `den`, respectively, and
     * the sign of the numerator to the sign of Frac
     * @param {bigint} num - The numerator of the rational number.
     * @param {bigint} den - The denominator of the rational number.
     */
    constructor(num: bigint, den: bigint) {
        super();
        this.#num = num * sign(den);
        this.#den = abs(den);
    }

    /**
     * get fraction numerator
     */
    get num() {
        return this.#num;
    }

    /**
     * get fraction denominator
     */
    get den() {
        return this.#den;
    }

    /**
     * get fraction value {num, den}
     */
    get value() {
        return { num: this.#num, den: this.#den };
    }

    /**
     * It takes a number or string, and returns a Frac object
     * @param {number | string} n - number (float or int) | string ("xxx.xxx" or "num/den")
     * @param [repeating=false] - boolean
     * @returns the corresponding fraction
     */
    static fromFloat(n: number | string, repeating = false): Frac {
        if (typeof n === 'number' && n.toString().length > 15) {
            n = n.toString().slice(0, -1);
            console.warn(
                'decimals > 15, consider using string instead of number due to float32 precision limits',
            );
        }
        n = n.toString();

        const sign = n.includes('-') ? -1n : 1n;
        n = n.replace('-', '');

        const decimals = BigInt(n.split('.')[1]?.length ?? 0);

        if (decimals === 0n) return new Frac(BigInt(n), 1n);

        const denominator = 10n ** decimals - (repeating ? 1n : 0n);
        const numerator = BigInt(n.replace('.', '')) -
            (repeating ? BigInt(n.split('.')[0]) : 0n);
        const _gcd = gcd(numerator, denominator);
        return new Frac((sign * numerator) / _gcd, denominator / _gcd);
    }

    /**
     * It takes a string of shape "int/int" and returns a fraction
     * @param {string} str - string
     * @returns A new instance of the Frac class
     */
    static fromString(str: string): Frac {
        if (str.includes('/')) {
            const num = BigInt(str.split('/')[0]);
            const den = BigInt(str.split('/')[1]);
            return new Frac(num, den);
        }
        throw new TypeError(`Invalid string ${str}`);
    }

    /**
     * It takes a JSON string or object, and returns a new Frac object
     * @param {string | Record<string, bigint>} json - string | Record<string, unknown>
     * @returns A new instance of the Frac class.
     */
    static fromJSON(json: string | Record<string, bigint>): Frac {
        const { num, den } = typeof json === 'string'
            ? JSON.parse(json)
            : (json as { num: bigint; den: bigint });
        return new Frac(num, den);
    }

    /**
     * It takes a string in the form of a LaTeX fraction, and returns a Frac object
     * @param {string} latex - string
     * @returns A new instance of the Frac class.
     */
    static fromLatex(latex: string): Frac {
        const sign = latex.match(/(\\left\(\s*-\s*).+(\\right\))/i) ? -1n : 1n;
        const match = latex.match(/frac{(\d+)}{(\d+)}/i);
        if (match?.length === 3) {
            const [_, num, den] = match as [string, string, string];
            return new Frac(sign * BigInt(num), BigInt(den));
        }
        throw new TypeError(`Unable to parse latex ${latex}`);
    }

    //Maths

    /**
     * returns a new fraction that is the sum of the current Frac and all args
     * @param {Frac[]} frac - Frac[]
     * @returns The return value is a new Frac
     */
    add(...frac: Frac[]): Frac {
        return [this, ...frac]
            .reduce((prev, curr) => {
                const num = prev.num * curr.den + curr.num * prev.den;
                const den = prev.den * curr.den;
                return new Frac(num, den);
            }, new Frac(0n, 1n))
            .simplify();
    }

    /**
     * returns a new fraction that is the subtraction of the current Frac by all args
     * @param {Frac[]} frac - Frac[]
     * @returns The return value is a new Frac
     */
    sub(...frac: Frac[]): Frac {
        return this.sub(...frac);
    }

    /**
     * returns a new fraction that is the product of the current Frac and all args
     * @param {Frac[]} frac - Frac[]
     * @returns The return value is a new Frac
     */
    multiply(...frac: Frac[]): Frac {
        return [this, ...frac]
            .reduce(
                (prev, curr) =>
                    new Frac(prev.num * curr.num, prev.den * curr.den),
                new Frac(1n, 1n),
            )
            .simplify();
    }

    /**
     * returns a new fraction that is the quotient of the current Frac by all args
     * @param {Frac[]} frac - Frac[]
     * @returns The return value is a new Frac
     */
    divide(...frac: Frac[]): Frac {
        return this.multiply(...frac.map((frac) => frac.invert())).simplify();
    }

    /**
     * It returns a new fraction that is the same as the original fraction, but simplified
     * @returns The simplified fraction.
     */
    simplify(): Frac {
        const { num, den } = this;
        const _gcd = gcd(num, den);
        return new Frac(num / _gcd, den / _gcd);
    }

    /**
     * It returns the inverse of the fraction.
     * @returns The inverse of the fraction.
     */
    invert(): Frac {
        return new Frac(this.den, this.num);
    }

    /**
     * It returns the opposite of the fraction
     * @returns The opposite of the fraction.
     */
    opposite(): Frac {
        return new Frac(-this.num, this.den);
    }

    /**
     * If the number is less than zero, return negative one, otherwise return positive one.
     * @returns The sign of the number.
     */
    // sign(): -1n | 1n {
    sign(): bigint { //TODO wait for https://github.com/denoland/deno/issues/14838 to be closed
        return this.#num < 0n ? -1n : 1n;
    }

    /**
     * Returns a new fraction object with the absolute value of the numerator
     * and denominator
     * @returns A new Frac object with the absolute value of the numerator and denominator.
     */
    abs(): Frac {
        return new Frac(abs(this.#num), this.#den);
    }

    //Logic

    /**
     * If the simplified denominator is 1, then the fraction is an integer.
     * @returns a boolean value.
     */
    isInt(): boolean {
        return this.simplify().#den === 1n;
    }

    /**
     * `isEven` returns true if the fraction is even, false otherwise
     * @returns A boolean value.
     */
    isEven(): boolean {
        const { num, den } = this.simplify();
        return (den === 1n) && (num % 2n === 0n);
    }

    /**
     * It returns true if the number is 0n, and false otherwise
     * @returns a boolean value.
     */
    isNull(): boolean {
        return this.num === 0n
    }

    /**
     * It compares two fractions and returns 0 if they are equal, 1 if the first is greater than the
     * second, and -1 if the first is less than the second.
     * @param {Frac} compared - The fraction to compare to.
     * @returns The sign of the difference between the two fractions.
     */
    // compare(compared: Frac): -1n | 0n | 1n {
    compare(compared: Frac): bigint { //TODO wait for https://github.com/denoland/deno/issues/14838 to be closed
        const { num: cNum, den: cDen } = compared.simplify().value;
        const { num, den } = this.simplify().value;
        if (num === cNum && den === cDen) return 0n;
        return this.sub(compared).sign();
    }

    /**
     * Returns true if the two fractions are equal, false otherwise.
     * @param {Frac} compared - The fraction to compare to.
     * @returns A boolean value.
     */
    isEqual(compared: Frac): boolean {
        return this.compare(compared) === 0n;
    }

    /**
     * Returns true if the current fraction is greater than the compared fraction, or if the compared
     * fraction is equal to the current fraction and ifEqual is true.
     * @param {Frac} compared - The fraction to compare to.
     * @param [ifEqual=false] - If true, the function will return true if the compared fraction is
     * equal to the current fraction.
     * @returns A boolean value.
     */
    isGreater(compared: Frac, ifEqual = false): boolean {
        if (ifEqual && this.compare(compared) === 0n) return true;
        return this.compare(compared) === 1n;
    }

    /**
     * Returns true if the current fraction is lesser than the compared fraction, or if the compared
     * fraction is equal to the current fraction and the ifEqual parameter is true.
     * @param {Frac} compared - The fraction to compare to.
     * @param [ifEqual=false] - If true, the function will return true if the compared fraction is
     * equal to the current fraction.
     * @returns The return value is a boolean.
     */
    isLesser(compared: Frac, ifEqual = false): boolean {
        if (ifEqual && this.compare(compared) === 0n) return true;
        return this.compare(compared) === -1n;
    }

    /**
     * It checks if the fraction is between two other fractions.
     * @param {Frac} min - The minimum value to compare to.
     * @param {Frac} max - The maximum value of the range.
     * @param [includeBounds=false] - If true, the bounds are included in the comparison.
     * @returns A boolean value
     */
    isBetween(min: Frac, max: Frac, includeBounds = false): boolean {
        return (
            this.isGreater(min, includeBounds) &&
            this.isLesser(max, includeBounds)
        );
    }

    //Conversion

    /**
     * If the numerator and denominator are within the range of a 32 bit float, and the denominator is
     * not zero, return the float value of the numerator divided by the denominator
     * @param {bigint} decimals - Number of significant decimals (0-16)
     * @returns A function that returns a float.
     */
    toFloat(decimals = 16n): number {
        if (decimals < 0n || decimals > 16n) {
            throw new RangeError(
                `Output decimals must be between 0 and 16, not ${decimals}`,
            );
        }
        if (
            Number.MAX_SAFE_INTEGER > this.#den &&
            Number.MIN_SAFE_INTEGER < this.#den &&
            Number.MAX_SAFE_INTEGER > this.#num &&
            Number.MIN_SAFE_INTEGER < this.#num &&
            this.#den !== 0n
        ) {
            return (
                Math.round(
                    Number(this.#num * 10n ** decimals) / Number(this.#den),
                ) /
                10 ** Number(decimals)
            );
        }
        throw new RangeError(
            `${this.toString()} cannot be converted to float 32, out of range`,
        );
    }

    /**
     * It returns a evaluable string representation of the fraction.
     * @returns The numerator and denominator of the fraction.
     */
    toString(): string {
        return `${this.#num}/${this.#den}`;
    }

    /**
     * If the numerator is negative, return the fraction wrapped in parentheses. Otherwise, return the
     * fraction as a LaTeX string
     * @returns A string.
     */
    toLatex(): string {
        const frac = `\\frac{${abs(this.#num)}}{${this.#den}}`;
        if (sign(this.#num) === -1n) return `\\left( - ${frac} \\right)`;
        return frac;
    }

    /**
     * The function returns a string that is a JSON representation of the object
     * @returns A string representation of the object.
     */
    toJSON(): string {
        return `{num: ${this.#num}, den: ${this.#den}}`;
    }
}
