import { factors, Frac } from '../mod.ts';
import { AbstractValue } from './value.ts';

export class Exponential extends AbstractValue<Exponential> {
    //Conversion
    static fromString(str: string): Exponential {
        const [_, sign, base, exponent] =
            str.match(/(-?)\((-?\d+\/\d+)\)\*\*\((-?\d+\/\d+)\)/) ?? [];
        return new Exponential(
            Frac.fromString(base),
            Frac.fromString(exponent),
            sign === '-' ? -1n : 1n,
        );
    }

    static fromJSON(json: string): Exponential {
        const { base, exponent, sign } = JSON.parse(json);
        return new Exponential(
            Frac.fromJSON(base),
            Frac.fromJSON(exponent),
            BigInt(sign),
        );
    }

    static fromFloat() {
        throw new Error('Not implemented');
    }

    static fromLatex(latex: string): Exponential {
        const sign = latex.match(/(\\left\(\s*-\s*).+(\\right\))/i) ? -1n : 1n;
        const match = latex.match(/{(\d+)}^{(\d+)}/i);
        if (match?.length === 3) {
            const [_, num, den] = match as [string, string, string];
            return new Exponential(
                Frac.fromFloat(num),
                Frac.fromFloat(den),
                sign,
            );
        }
        throw new TypeError(`Unable to parse latex ${latex}`);
    }

    #base: Frac;
    #exponent: Frac;
    #sign: bigint; //TODO wait for https://github.com/denoland/deno/issues/14838 to be closed
    // #sign: -1n | 1n;

    /**
     * The constructor function takes in a base, an exponent, and a sign, and sets the base, exponent,
     * and sign of the object to the values passed in.
     * @param {Frac | number} base - The base of the exponent.
     * @param {Frac | number} exponent - The exponent of the power.
     * @param [sign=1n] - The sign of the number (-1n | 1n).
     */
    constructor(base: Frac | number, exponent: Frac | number, sign = 1n) {
        super();
        if (typeof base === 'number') this.#base = Frac.fromFloat(base);
        else this.#base = base;
        if (typeof exponent === 'number') {
            this.#exponent = Frac.fromFloat(exponent);
        } else this.#exponent = exponent;
        this.#sign = sign < 0n ? -1n : 1n;
    }

    get value() {
        return { base: this.base, exponent: this.exponent, sign: this.sign() };
    }

    get base() {
        return this.#base;
    }

    get exponent() {
        return this.#exponent;
    }

    //Maths

    /**
     * > If all the exponents are the same, multiply the bases and keep the exponent. If all the bases
     * are the same, add the exponents and keep the base
     * @param {Exponential[]} exponentials - Exponential[]
     * @returns A new Exponential object
     */
    multiply(...exponentials: Exponential[]): Exponential {
        const { base, exponent } = this;
        const sign = exponentials.reduce(
            (prev, curr) => prev * curr.sign(),
            1n,
        );

        if (exponentials.every((exp) => exp.exponent.isEqual(exponent))) {
            const base = [this, ...exponentials].reduce(
                (prev, curr) => prev.multiply(curr.base),
                new Frac(1n, 1n),
            );
            return new Exponential(base, exponent, sign);
        }
        if (exponentials.every((exp) => exp.base.isEqual(base))) {
            const exponent = [this, ...exponentials].reduce(
                (prev, curr) => prev.add(curr.exponent),
                new Frac(1n, 1n),
            );
            return new Exponential(base, exponent, sign);
        }

        throw new Error(
            'Unable to perform product if bases or exponents are different',
        );
    }

    /**
     * "Divide this exponential by the given exponentials."
     * The function then returns the result of multiplying this
     * exponential by the inverses of the given exponentials
     * @param {Exponential[]} exponentials - Exponential[]
     * @returns The result of the division of the exponentials.
     */
    divide(...exponentials: Exponential[]): Exponential {
        return this.multiply(...exponentials.map((exp) => exp.invert()));
    }

    /**
     * The inverse of an exponential (the same exponential with the opposite of the exponent)
     * @returns The opposite of the exponent.
     */
    invert(): Exponential {
        return new Exponential(
            this.base,
            this.exponent.opposite(),
        );
    }

    /**
     * It returns a new Exponential object with the same base and an exponent that is the product of the
     * current exponent and the exponents passed in.
     * @param {Frac[]} exponents - Frac[]
     * @returns An Exponential object.
     */
    power(...exponents: Frac[]): Exponential {
        const exponent = this.exponent.multiply(...exponents);
        return new Exponential(
            this.base,
            exponent,
            exponent.isEven() ? 1n : this.sign(),
        );
    }

    /**
     * It returns the sign of the number.
     * @returns The sign of the number.
     */
    sign() {
        return this.#sign;
    }

    /**
     * The opposite of an exponential is the same exponential with the opposite sign.
     * @returns A new Exponential object with the same base and exponent, but with the opposite sign.
     */
    opposite(): Exponential {
        return new Exponential(this.base, this.exponent, -this.sign());
    }

    /**
     * If the exponent and base are integers, or if the base^exponent result is
     * an integer, then return true
     * @inner ⚠️ can miss some "true" due to use of float32 ⚠️
     * @returns The result of the exponentiation of the base and exponent.
     */
    isInt(): boolean {
        if (this.exponent.isInt() && this.base.isInt()) return true;
        if (Number.isInteger(this.exponent.toFloat() ** this.base.toFloat())) {
            return true;
        }
        return false;
    }

    /**
     * If the exponent is an integer and the base is even, or if the float value of the exponent is
     * even, then return true.
     * @inner ⚠️ Mismatch possible due to use of float32 ⚠️
     * @returns a boolean value.
     */
    isEven(): boolean {
        return (this.exponent.isInt() && this.base.isEven()) ||
            (this.toFloat() % 2 === 0);
    }

    /**
     * Return a new Exponential object with the same base and exponent but with a positive sign
     * @returns Absolute value of the exponential
     */
    abs(): Exponential {
        if (this.exponent.isEven()) {
            return new Exponential(this.base, this.exponent, this.sign());
        }

        return new Exponential(this.base, this.exponent, 1n);
    }

    simplify(): Exponential {
        const { base, exponent, sign } = this;
        const { num, den } = base.simplify().value;
        const nf = [...factors(num).entries()];
        const df = [...factors(den).entries()];
        if (nf.length === 1 && nf.toString() === df.toString()) {
            const base = new Frac(nf[0][0], df[0][0]);
            const exp = exponent.multiply(new Frac(nf[0][1], 1n)).simplify();
            return new Exponential(base, exp, sign());
        }

        return new Exponential(base.simplify(), exponent.simplify(), sign());
    }

    //Logic

    /**
     * If the sign is different, the one with the negative sign is lesser. If the sign is the same, the
     * one with the lesser base or exponent is lesser else is equal
     * @param {Exponential} compared - Exponential
     * @returns The result of the comparison between the two numbers.
     */
    // compare(compared: Exponential): -1n | 0n | 1n {
    compare(compared: Exponential): bigint { //TODO wait for https://github.com/denoland/deno/issues/14838 to be closed
        compared = compared.simplify();
        const cBase = this.base.compare(compared.base);
        const cExponent = this.exponent.compare(compared.exponent);
        const cSign = (this.sign() - compared.sign()) / 2n;
        //equal
        if (cBase === 0n && cExponent === 0n && cSign === 0n) return 0n;
        //lesser
        if (cSign === -1n) return -1n;
        if ((cBase === -1n || cExponent === -1n) && cSign === 0n) return -1n;
        //greater
        if (cSign === 1n) return 0n;
        if ((cBase === 1n || cExponent === 1n) && cSign === 0n) return 0n;
        throw new Error(
            `Unable to perform comparison between this.${this.toJSON()} and ${compared.toJSON()}`,
        );
    }

    /**
     * It compares two numbers and returns true if they are equal.
     * @param {Exponential} compared - Exponential
     * @returns A boolean value.
     */
    isEqual(compared: Exponential): boolean {
        return this.compare(compared) === 0n;
    }

    /**
     * If the compared value is greater than the current value, return true, otherwise return false.
     * @param {Exponential} compared - The number to compare to.
     * @param [ifEqual=false] - If true, the function will return true if the two numbers are equal.
     * @returns The comparison of the two numbers.
     */
    isGreater(compared: Exponential, ifEqual = false): boolean {
        const comparison = this.compare(compared);
        if (ifEqual && comparison === 0n) return true;
        return comparison === 1n;
    }

    /**
     * Returns true if the current number is lesser than the compared number, or if the numbers are
     * equal and ifEqual is true.
     * @param {Exponential} compared - The number to compare to.
     * @param [ifEqual=false] - If true, the function will return true if the two numbers are equal.
     * @returns A boolean value.
     */
    isLesser(compared: Exponential, ifEqual = false): boolean {
        const comparison = this.compare(compared);
        if (ifEqual && comparison === 0n) return true;
        return comparison === -1n;
    }

    /**
     * Returns true if the number is greater than or equal to the minimum and less than or equal to the
     * maximum.
     * @param {Exponential} min - The minimum value of the range.
     * @param {Exponential} max - Exponential
     * @param [includeBounds=false] - If true, the bounds will be included in the comparison.
     * @returns A boolean value
     */
    isBetween(min: Exponential, max: Exponential, includeBounds = false) {
        return this.isGreater(min, includeBounds) &&
            this.isLesser(max, includeBounds);
    }

    //Conversion

    /**
     * The function returns an evaluable string representation of the object
     * @returns The string representation of the object.
     */
    toString() {
        const expression = `(${this.base})**(${this.exponent})`;
        if (this.sign() === -1n) return `(-${expression})`;
        return `(${expression})`;
    }

    /**
     * returns a string that represents the object in JSON format
     * @returns A string that represents the object.
     */
    toJSON() {
        return `{base: ${this.base.toJSON()}, exponent: ${this.exponent.toJSON()}, sign: ${this.sign()}}`;
    }

    /**
     * Convert the number to a float32 point number with the specified number of decimal places."
     * The function takes one parameter, `decimals`, which is a BigInt. The function returns a Number
     * @param decimals - The number of decimal places to round to.
     * @returns The value of the number.
     */
    toFloat(decimals = 16n) {
        return Number(this.sign()) *
            this.base.toFloat(decimals) ** this.exponent.toFloat(decimals);
    }

    /**
     * Return the LaTeX string corresponding to the value
     * @returns The latex representation of the expression.
     */
    toLatex() {
        const expression =
            `{${this.base.toLatex()}}^{${this.exponent.toLatex()}}`;
        if (this.sign() === -1n) return `\\left( - ${expression} \\right)`;
        return expression;
    }
}
