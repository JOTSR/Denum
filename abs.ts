/**
 * Returns the absolute value of a number.
 * @param {number} value Numeric expression for which the absolute value is needed.
 * @returns {number} Absolute value of input
 */
export function abs(value: number): number;
/**
 * Returns the absolute value of a number.
 * @param {bigint} value Numeric expression for which the absolute value is needed.
 * @returns {bigint} Absolute value of input
 */
export function abs(value: bigint): bigint;
export function abs(value: number | bigint): number | bigint {
  return value < 0 ? -value : value;
}