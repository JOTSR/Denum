export abstract class AbstractValue<T>{
    constructor() {}
    /**
     * Static methods
     */
    //Convert to
    static toString: <T>(value: T) => string
    static toFloat: <T>(value: T, decimals: bigint) => number
    static toLatex: <T>(value: T) => string
    //Convert from
    static fromString: <T>(string: string) => T
    static fromFloat: <T>(string: string) => T
    static fromLatex: <T>(string: string) => T
    //Maths
    static invert: <T>(value: T) => T
    static opposite: <T>(value: T) => T
    static simplify: <T>(value: T) => T
    /**
     * Properties
     */
    //getters
    abstract get value(): Record<string, bigint | number>
    /**
     * Instance methods
     */
    //Maths
    abstract invert(): T
    abstract opposite(): T
    abstract simplify(): T
    abstract sign(): -1n | 1n
    abstract abs(): T
    //Logical
    abstract compare(): -1n | 0n | 1n
    abstract isEqual(): boolean
    abstract isGreater(): boolean
    abstract isLesser(): boolean
    abstract isGtEqual(): boolean
    abstract isLtEqual(): boolean
    //Conversion
    abstract toString(): string
    abstract toFloat(decimals: bigint): number
    abstract toLatex(): string
}