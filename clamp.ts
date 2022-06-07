/**
 * Clamp a value between min and max
 * @param {number} value Value to be bounded
 * @param {number} min Lower bound
 * @param {number} max Upper bound
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number;
/**
 * Clamp a value between min and max
 * @param {bigint} value Value to be bounded
 * @param {bigint} min Lower bound
 * @param {bigint} max Upper bound
 * @returns Clamped value
 */
export function clamp(value: bigint, min: bigint, max: bigint): bigint;
export function clamp<T extends number | bigint>(
  value: T,
  min: T,
  max: T,
): T {
  if (min > max) {
    throw new RangeError(`Invalid range, min:${min} > max: ${max}`);
  }
  return value > max ? max : value < min ? min : value;
}
