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
      n = Frac.toFrac(n, repeating);
    }
    this.#num = n.num * sign(n.den);
    this.#den = abs(n.den);
  }

  get num() {
    return this.#num;
  }

  get den() {
    return this.#den;
  }

  get value() {
    return { num: this.#num, den: this.#den };
  }

  /**
   * It takes a number or string, and returns a Frac object
   * @param {number | string} n - number (float or int) | string ("xxx.xxx" or "num/den")
   * @param [repeating=false] - boolean
   * @returns the corresponding fraction
   */
  static toFrac(n: number | string, repeating = false): Frac {
    if (typeof n === 'number' && n.toString().length > 15) {
      n = n.toString().slice(0, -1);
      console.warn(
        'decimals > 15, consider using string instead of number due to float32 precision limits',
      );
    }
    n = n.toString();

    if (n.includes('/')) {
      const num = BigInt(n.split('/')[0]);
      const den = BigInt(n.split('/')[1]);
      return new Frac({ num, den });
    }

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

  toString(): string {
    return `${this.#num}/${this.#den}`;
  }

  toLatex(): string {
    const frac = `\\frac{${abs(this.#num)}}{${this.#den}}`;
    if (sign(this.#num) === -1n) return `\\left( - ${frac} \\right)`;
    return frac;
  }

  //TODO static fromLatex
}
