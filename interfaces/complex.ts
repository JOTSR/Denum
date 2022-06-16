import { AbstractValue } from './value.ts';
import { Exponential, Frac } from '../mod.ts';

function unstable(_constructor: unknown) {
    console.warn('Complex is an unstable API, expect breaking changes');
}

/**
 * ⚠️ Complex is an unstable API, expect breaking changes ⚠️
 */
@unstable
export class Complex<T extends Frac | Exponential>
    extends AbstractValue<Complex<T>> {
    /**
     * ⚠️ Complex is not convertible to an evaluable js string ⚠️
     * If you try to parse a string to a Complex you'll get an error.
     */
    static fromString<T extends Frac | Exponential>(_str: string): Complex<T> {
        throw new TypeError(
            'Complex is not convertible to an evaluable js string',
        );
    }

    /**
     * It takes a string or an object with two properties, re and im, and returns a Complex object
     * @param {string | Record<string, unknown>} json - string | Record<string, unknown>
     * @returns A new Complex object.
     */
    static fromJSON<T extends Frac | Exponential>(
        json: string | Record<string, unknown>,
    ): Complex<T> {
        if (typeof json === 'string') {
            const { re, im } = JSON.parse(json);
            try {
                let errors = 0;
                try {
                    return new Complex<T>(
                        Frac.fromJSON(re) as T,
                        Frac.fromJSON(im) as T,
                    );
                } catch {
                    errors++;
                }
                try {
                    return new Complex<T>(
                        Exponential.fromJSON(re) as T,
                        Exponential.fromJSON(im) as T,
                    );
                } catch {
                    if (errors === 1) throw new Error();
                }
            } catch {
                throw new TypeError(
                    `Type of [re, im] not Frac|Exponential in json string: ${json}`,
                );
            }
        }
        const { re, im } = json as { re: T; im: T };
        return new Complex(re, im);
    }

    /**
     * It takes a LaTeX string in the form of `a + ib` and returns a Complex object with `a` and `b` as the
     * real and imaginary parts respectively
     * @param {string} latex - string
     * @returns A new Complex object with the real and imaginary parts being the Frac or Exponential
     * objects.
     */
    //@ts-ignore throw an Error if no return
    static fromLatex<T extends Frac | Exponential>(latex: string): Complex<T> {
        const [_, re, im] = latex.match(/(.)\s*\+\s*i\s*(.)/) ?? [];
        try {
            let errors = 0;
            try {
                return new Complex<T>(
                    Frac.fromLatex(re) as T,
                    Frac.fromLatex(im) as T,
                );
            } catch {
                errors++;
            }
            try {
                return new Complex<T>(
                    Exponential.fromLatex(re) as T,
                    Exponential.fromLatex(im) as T,
                );
            } catch {
                if (errors === 1) throw new Error();
            }
        } catch {
            throw new TypeError(
                `Type of [re, im] not Frac|Exponential in LaTeX string: ${latex}`,
            );
        }
    }

    /**
     * ⚠️ float32 is not convertible to Complex ⚠️
     * If you try to convert a float to a complex you'll get an error.
     * @param {number} _float - float32
     */
    static fromFloat<T extends Frac | Exponential>(_float: number): Complex<T> {
        throw new TypeError('float32 is not convertible to Complex');
    }

    #re: T;
    #im: T;

    /**
     * Allows to store and manipulate complex numbers
     * Returns a new instance of Complex
     * @param {Exponential} re - Exponential | Frac
     * @param {Exponential} im - Exponential | Frac
     */
    constructor(re: T, im: T) {
        super();
        this.#re = re;
        this.#im = im;
    }

    get re() {
        return this.#re;
    }

    get im() {
        return this.#im;
    }

    get value() {
        return { re: this.re.value, im: this.im.value };
    }

    //Maths

    /**
     * It takes a complex number, and returns its inverse.
     * ⚠️ Only works if Complex<Frac> or Complex<Exponential> with re and im base ** exponent and exponent are integer ⚠️
     * @returns A new Complex object with the inverse of the original Complex object.
     */
    invert(): Complex<T> {
        if (this.re instanceof Frac && this.im instanceof Frac) {
            const den = this.re.power(2n).add(this.im.power(2n));
            const re = this.re.divide(den);
            const im = this.im.opposite().divide(den);

            //@ts-ignore type constrained
            return new Complex<Frac>(re, im);
        }

        if (this.re instanceof Exponential && this.im instanceof Exponential) {
            if (
                this.re.isInt() &&
                this.im.isInt() &&
                this.re.exponent.isInt() &&
                this.im.exponent.isInt()
            ) {
                const re = this.re.base.power(this.re.exponent.simplify().num);
                const im = this.im.base.power(this.im.exponent.simplify().num);

                const den = re.power(2n).add(im.power(2n));
                const invRe = re.divide(den);
                const invIm = im.opposite().divide(den);

                //@ts-ignore type constrained
                return new Complex<Exponential>(invRe, invIm);
            }
        }

        throw new TypeError(
            `Unable to perform addition on non int exponentials: ${this.toJSON()}`,
        );
    }

    /**
     * The opposite of a complex number is the complex number with the opposite real and imaginary
     * parts
     * @returns A new Complex object with the opposite of the real and imaginary parts.
     */
    opposite(): Complex<T> {
        return new Complex<T>(this.re.opposite() as T, this.im.opposite() as T);
    }

    /**
     * The conjugate of a complex number is the complex number with the same real part and an imaginary
     * part with the opposite sign
     * @returns A new Complex object with the real part of the original object and the imaginary part
     * of the original object with the opposite sign.
     */
    conjugate(): Complex<T> {
        return new Complex<T>(this.re, this.im.opposite() as T);
    }

    /**
     * The function `simplify()` returns a new `Complex` object with the real and imaginary parts
     * simplified
     * @returns A new Complex object with the simplified real and imaginary parts.
     */
    simplify(): Complex<T> {
        return new Complex<T>(this.re.simplify() as T, this.im.simplify() as T);
    }

    /**
     * ⚠️ Sign is not Complex is not relevant for a complex ⚠️
     * The function returns the sign of a number
     */
    sign(): bigint {
        throw new TypeError('Complex number have no sign');
    }

    /**
     * ⚠️ real and imaginary part must be integer Exponential or Frac ⚠️
     * ⚠️ return an instance of Exponential ⚠️
     * It takes a complex number, and returns its modulus
     * @returns The return value is a new instance of the Exponential class.
     */
    //@ts-ignore can't return a complex
    abs(): Exponential {
        const { re, im } = this.value;
        if (re instanceof Frac && im instanceof Frac) {
            const base = re.power(2n).add(im.power(2n));
            return new Exponential(base, 0.5);
        }
        if (re instanceof Exponential && im instanceof Exponential) {
            const _re = re.power(Frac.fromFloat(2));
            const _im = im.power(Frac.fromFloat(2));
            if (_re.isInt() && _im.isInt()) {
                const base = Frac.fromFloat(_re.toFloat() + _im.toFloat());
                return new Exponential(base, 0.5);
            }
            throw new TypeError(
                `real and imaginary part must be integer Exponential, ${this.toJSON()}`,
            );
        }
        throw new TypeError(
            `real and imaginary part must be integer Exponential or Frac, ${this.toJSON()}`,
        );
    }

    //Logical
    /**
     * ⚠️ Complex can't be compared ⚠️
     * It compares two complex and returns 0 if they are equal, 1 if the first is greater than the
     * second, and -1 if the first is less than the second.
     * @param {Frac} _compared - The complex to compare to.
     * @returns The sign of the difference between the two complex.
     */
    compare(_compared: Complex<T>): bigint {
        throw new TypeError('Complex can\'t be compared');
    }

    /**
     * ⚠️ Complex can't be compared ⚠️
     * Returns true if the two complex are equal, false otherwise.
     * @param {Complex} compared - The complex to compare to.
     * @returns A boolean value.
     */
    isEqual(compared: Complex<T>): boolean {
        return this.compare(compared) === 0n;
    }

    /**
     * ⚠️ Complex can't be compared ⚠️
     * Returns true if the current complex is greater than the compared complex, or if the compared
     * complex is equal to the current complex and ifEqual is true.
     * @param {Complex} compared - The complex to compare to.
     * @param [ifEqual=false] - If true, the function will return true if the compared complex is
     * equal to the current complex.
     * @returns A boolean value.
     */
    isGreater(compared: Complex<T>, ifEqual = false): boolean {
        if (ifEqual && this.compare(compared) === 0n) return true;
        return this.compare(compared) === 1n;
    }

    /**
     * ⚠️ Complex can't be compared ⚠️
     * Returns true if the current complex is lesser than the compared complex, or if the compared
     * complex is equal to the current complex and the ifEqual parameter is true.
     * @param {Complex} compared - The complex to compare to.
     * @param [ifEqual=false] - If true, the function will return true if the compared complex is
     * equal to the current complex.
     * @returns The return value is a boolean.
     */
    isLesser(compared: Complex<T>, ifEqual = false): boolean {
        if (ifEqual && this.compare(compared) === 0n) return true;
        return this.compare(compared) === -1n;
    }

    /**
     * ⚠️ Complex can't be compared ⚠️
     * It checks if the complex is between two other complex.
     * @param {Complex} min - The minimum value to compare to.
     * @param {Complex} max - The maximum value of the range.
     * @param [includeBounds=false] - If true, the bounds are included in the comparison.
     * @returns A boolean value
     */
    isBetween(
        min: Complex<T>,
        max: Complex<T>,
        includeBounds = false,
    ): boolean {
        return (
            this.isGreater(min, includeBounds) &&
            this.isLesser(max, includeBounds)
        );
    }

    /**
     * Returns true if the real and imaginary parts of the complex number are integers.
     * @returns The return value is a boolean.
     */
    isInt(): boolean {
        return this.re.isInt() && this.im.isInt();
    }

    /**
     * Return true if the real part is not null, if pure, return true if imaginary part is null, otherwise return false
     * @param [pure=true] - boolean - If true, the function will return true if the real part is not null
     * @returns {boolean}
     */
    isReal(pure = true): boolean {
        //@ts-ignore nullish coalescing
        if (pure && (this.im?.isNull() ?? false)) return true;
        //@ts-ignore nullish coalescing
        return !this.re?.isNull() ?? false;
    }

    /**
     * Return true if the imaginary part is not null, if pure, return true if real part is null, otherwise return false
     * @param [pure=true] - boolean - If true, the function will return true if the imaginary part is not null
     * @returns {boolean}
     */
    isImg(pure = true): boolean {
        //@ts-ignore nullish coalescing
        if (pure && (this.re?.isNull() ?? false)) return true;
        //@ts-ignore nullish coalescing
        return !this.im?.isNull() ?? false;
    }

    /**
     * If the real part is even and the imaginary part is even, then return true, otherwise return
     * false.
     * @returns The return value is a boolean.
     */
    isEven(): boolean {
        return this.re.isEven() && this.im.isEven();
    }

    //Conversion

    /**
     * ⚠️ Complex is not convertible to an evaluable js string ⚠️
     * If you try to convert a Complex object to a string, you'll get an error.
     */
    toString(): string {
        throw new TypeError(
            'Complex is not convertible to an evaluable js string',
        );
    }

    /**
     * The function returns a string that is a JSON representation of the object
     * @returns A string.
     */
    toJSON(): string {
        return `{re: ${this.re}, im: ${this.im}}`;
    }

    /**
     * ⚠️ Complex is not convertible to float32 ⚠️
     * If you try to convert a complex number to a float, you'll get an error.
     * @param {bigint} _decimals - bigint
     */
    toFloat(_decimals: bigint): number {
        throw new TypeError('Complex is not convertible to float32');
    }

    /**
     * returns the LaTeX representation of the complex number
     * @returns The return value is a LaTeX string.
     */
    toLatex(): string {
        return `${this.re.toLatex()} + i${this.im.toLatex()}`;
    }
}
