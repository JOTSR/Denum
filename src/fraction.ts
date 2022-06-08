import { abs, gcd, sign } from '../mod.ts';

export class Frac {
  #num: bigint;
  #den: bigint;

  /**
   * If the input is a number or string, convert it to a fraction, otherwise, just use the input as is
   * The `repeating` parameter is used to indicate whether the input is a repeating decimal or not
   * @param {number | string | { num: bigint, den: bigint }} n - number | string | { num: bigint; den: bigint }
   * @param [repeating=false] - boolean
   */
  constructor(
    n: number | string | { num: bigint; den: bigint },
    repeating = false,
  ) {
    if (typeof n === 'number' || typeof n === 'string') {
      n = Frac.fromNumber(n, repeating);
    }
    this.#num = n.num * sign(n.den);
    this.#den = abs(n.den);
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
  static fromNumber(n: number | string, repeating = false): Frac {
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

    if (decimals === 0n) return new Frac({ num: BigInt(n), den: 1n });

    const denominator = 10n ** decimals - (repeating ? 1n : 0n);
    const numerator = BigInt(n.replace('.', '')) -
      (repeating ? BigInt(n.split('.')[0]) : 0n);
    const _gcd = gcd(numerator, denominator);
    return new Frac({ num: sign * numerator / _gcd, den: denominator / _gcd });
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
      return new Frac({ num, den });
    }
    throw new TypeError(`Invalid string ${str}`)
  }

  /**
   * It takes a string in the form of a LaTeX fraction, and returns a Frac object
   * @param {string} latex - string
   * @returns A new instance of the Frac class.
   */
  static fromLatex(latex: string): Frac {
    const sign = latex.match(/(\\left\(\s*-\s*).+(\\right\))/i) ? -1n : 1n
    const match = latex.match(/frac{(\d+)}{(\d+)}/i)
    if (match?.length === 3) {
      const [_, num, den] = match as [string, string, string]
      return new Frac({num: sign * BigInt(num), den: BigInt(den)})
    }
    throw new TypeError(`Unable to parse latex ${latex}`)
  }

  /**
   * Return the simplified fraction sum from an array of fractions
   * @param {Frac[]} frac - Frac[]
   * @returns simplified sum Frac
   */
  static add(...frac: Frac[]): Frac {
    const result = frac.reduce((prev, curr) => {
      const num = prev.num * curr.den + curr.num * prev.den;
      const den = prev.den * curr.den;
      return new Frac({ num, den });
    }, new Frac(0));
    return Frac.simplify(result);
  }

  /**
   * Return the simplified fraction subtraction of the first item by all followings fractions
   * @param {Frac[]} frac - Frac[]
   * @returns simplified sub Frac
   */
  static sub(...frac: Frac[]): Frac {
    const result = Frac.add(
      frac[0],
      ...frac
        .slice(1)
        .map((frac) => new Frac({ num: -frac.num, den: frac.den })),
    );
    return Frac.simplify(result);
  }

  /**
   * Return the simplified fraction product from an array of fractions
   * @param {Frac[]} frac - Frac[]
   * @returns simplified product Frac
   */
  static multiply(...frac: Frac[]): Frac {
    const result = frac.reduce(
      (prev, curr) =>
        new Frac({
          num: prev.num * curr.num,
          den: prev.den * curr.den,
        }),
      new Frac(1),
    );
    return Frac.simplify(result);
  }

  /**
   * Return the simplified fraction quotient by dividing the first item by all the followings
   * @param {Frac[]} frac - Frac[]
   * @returns simplified quotient Frac
   */
  static divide(...frac: Frac[]): Frac {
    const result = Frac.multiply(
      frac[0],
      ...frac
        .slice(1)
        .map((frac) => new Frac({ num: frac.den, den: frac.num })),
    );
    return Frac.simplify(result);
  }

  /**
   * It takes a fraction, and returns a fraction with the same value, but with the numerator and
   * denominator reduced to their lowest common terms
   * @param {Frac} frac - The fraction to simplify
   * @returns simplified Frac
   */
  static simplify(frac: Frac): Frac {
    const { num, den } = frac;
    const _gcd = gcd(num, den);
    return new Frac({ num: num / _gcd, den: den / _gcd });
  }

  /**
   * returns a new fraction that is the sum of the current Frac and all args
   * @param {Frac[]} frac - Frac[]
   * @returns The return value is a new Frac
   */
  add(...frac: Frac[]): Frac {
    return Frac.add(this, ...frac)
  }

  /**
   * returns a new fraction that is the subtraction of the current Frac by all args
   * @param {Frac[]} frac - Frac[]
   * @returns The return value is a new Frac
   */
  sub(...frac: Frac[]): Frac {
    return Frac.sub(this, ...frac)
  }

  /**
   * returns a new fraction that is the product of the current Frac and all args
   * @param {Frac[]} frac - Frac[]
   * @returns The return value is a new Frac
   */
  multiply(...frac: Frac[]): Frac {
    return Frac.multiply(this, ...frac)
  }

  /**
   * returns a new fraction that is the quotient of the current Frac by all args
   * @param {Frac[]} frac - Frac[]
   * @returns The return value is a new Frac
   */
  divide(...frac: Frac[]): Frac {
    return Frac.divide(this, ...frac)
  }


  /**
   * It returns a new fraction that is the same as the original fraction, but simplified
   * @returns The simplified fraction.
   */
  simplify(): Frac {
    return Frac.simplify(this)
  }

  /**
   * If the numerator and denominator are within the range of a 32 bit float, and the denominator is
   * not zero, return the float value of the numerator divided by the denominator
   * @returns A function that returns a float.
   */
  toFloat(): number {
    if (
      Number.MAX_SAFE_INTEGER > this.#den &&
      Number.MIN_SAFE_INTEGER < this.#den &&
      Number.MAX_SAFE_INTEGER > this.#num &&
      Number.MIN_SAFE_INTEGER < this.#num &&
      this.#den !== 0n
    ) {
      return Number(this.#num) / Number(this.#den);
    }
    throw new RangeError(
      `${this.toString()} cannot be converted to float 32, out of range`,
    );
  }

  /**
   * It returns a string representation of the fraction.
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
}
