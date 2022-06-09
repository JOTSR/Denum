/**
 * Get the given quantile associate to an array of values
 * @param {bigint[]} values Values to process on
 * @param {number} ceil Quantile subdivision (0.5 for median)
 * @returns {bigint} Selected quantile
 */
export function quantile(values: bigint[], ceil: number): bigint;
/**
 * Get the given quantile associate to an array of values
 * @param {number[]} values Values to process on
 * @param {number} ceil Quantile subdivision (0.5 for median)
 * @returns {number} Selected quantile
 */
export function quantile(values: number[], ceil: number): number;
export function quantile<T extends number | bigint>(
    values: T[],
    ceil: number,
): T {
    const sorted = [...values].sort((a, b) => a < b ? -1 : 1);
    return sorted[Math.round(values.length * ceil) - 1];
}

/**
 * Get the median of an array of values
 * @param {...bigint} values Values to process on
 * @returns {bigint} Median
 */
export function median(...values: bigint[]): bigint;
/**
 * Get the median of an array of values
 * @param {...number} values Values to process on
 * @returns {number} Median
 */
export function median(...values: number[]): number;
export function median<T extends number | bigint>(...values: T[]): T {
    //@ts-ignore: Unreachable type error
    return quantile<T>(values, 0.5);
}
