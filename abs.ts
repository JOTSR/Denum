function _abs(value: number): number;
function _abs(value: bigint): bigint;
/**
 * Returns the absolute value of a number.
 * @param value Numeric expression for which the absolute value is needed.
 * @returns Absolute value of input
 */
function _abs(value: number | bigint): number | bigint {
  return value < 0 ? -value : value;
}

export const abs = _abs;
