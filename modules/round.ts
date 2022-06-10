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
    const intPart = Math.trunc(number)
    const decimalPart = parseFloat(`0.${number.toString().split('.')[1] ?? 0}`)
    if (mode == 'ceil') return intPart + Math.ceil(decimalPart * power) / power;
    if (mode == 'floor') return intPart + Math.floor(decimalPart * power) / power;
    return intPart + Math.round(decimalPart * power) / power;
}
