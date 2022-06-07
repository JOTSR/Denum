/**
 * Round a value following parameters
 * @param number Number to round
 * @param decimals Decimals to conserve (default = 0)
 * @param mode Round mode (default = nearest)
 * @returns Rounded value
 */
export function round(
  number: number,
  decimals = 0,
  mode: 'ceil' | 'floor' | 'nearest' = 'nearest',
): number {
  const power = 10 ** decimals;
  if (mode == 'ceil') return Math.ceil(number * power) / power;
  if (mode == 'floor') return Math.floor(number * power) / power;
  return Math.round(number * power) / power;
}
