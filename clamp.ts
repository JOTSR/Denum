function _clamp(value: number, min: number, max: number): number;
function _clamp(value: BigInt, min: BigInt, max: BigInt): BigInt;
function _clamp(
  value: number | BigInt,
  min: number | BigInt,
  max: number | BigInt,
): number | BigInt {
  if (min > max) {
    throw new RangeError(`Invalid range, min:${min} > max: ${max}`);
  }
  return value > max ? max : value < min ? min : value;
}

/**
 * Clamp a value between min and max
 * @param value Value to be bounded
 * @param min Lower bound
 * @param max Upper bound
 * @returns Clamped value
 */
export const clamp = _clamp;
