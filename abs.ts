function _abs(value: number): number;
function _abs(value: BigInt): BigInt;
function _abs(value: number | BigInt): number | BigInt {
  return value < 0 ? -value : value;
}

/**
 * Returns the absolute value of a number.
 * @param value Numeric expression for which the absolute value is needed.
 * @returns Absolute value of input
 */
export const abs = _abs;
