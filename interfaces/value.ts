export abstract class AbstractValue<T> {
    constructor() {}
    /**
     * Static methods
     */
    //Conversion
    // static fromString: <T>(string: string) => T
    // static fromJSON: <T>(string: string | Record<string, unknown>) => T
    // static fromFloat: <T>(string: string) => T
    // static fromLatex: <T>(string: string) => T
    /**
     * Properties
     */
    //getters
    abstract get value(): Record<string, unknown>;
    /**
     * Instance methods
     */
    //Maths
    abstract invert(): T;
    abstract opposite(): T;
    abstract simplify(): T;
    // abstract sign(): -1n | 1n
    abstract sign(): bigint; //TODO wait for https://github.com/denoland/deno/issues/14838 to be closed
    abstract abs(): T;
    //Logical
    abstract compare(value: T): bigint; //TODO wait for https://github.com/denoland/deno/issues/14838 to be closed
    // abstract compare(value: T): -1n | 0n | 1n
    abstract isEqual(value: T): boolean;
    abstract isGreater(value: T, ifEqual: boolean): boolean;
    abstract isLesser(value: T, ifEqual: boolean): boolean;
    abstract between(min: T, max: T, includeBounds: boolean): boolean;
    abstract isInt(): boolean;
    abstract isEven(): boolean;
    //Conversion
    abstract toString(): string;
    abstract toJSON(): string;
    abstract toFloat(decimals: bigint): number;
    abstract toLatex(): string;
}
