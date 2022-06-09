/**
 * Re-map a value from initial bounds to another bounds
 * @param {number} value Value to map
 * @param {[number, number]} initialBounds [min, max] initial bounds
 * @param {[number, number]} destinationBounds [min, max] destination bounds
 * @returns {number} Re-mapped value
 */
export function map(
    value: number,
    initialBounds: [number, number],
    destinationBounds: [number, number],
): number;
/**
 * Re-map a value from initial bounds to another bounds
 * @param {bigint} value Value to map
 * @param {[bigint, bigint]} initialBounds [min, max] initial bounds
 * @param {[bigint, bigint]} destinationBounds [min, max] destination bounds
 * @returns {bigint} Re-mapped value
 */
export function map(
    value: bigint,
    initialBounds: [bigint, bigint],
    destinationBounds: [bigint, bigint],
): bigint;
export function map<T extends number | bigint>(
    value: T,
    initialBounds: [T, T],
    destinationBounds: [T, T],
): T {
    if (value < initialBounds[0] || value > initialBounds[1]) {
        throw new RangeError(
            `Value(${value}) is out of bounds [${initialBounds.join(', ')}]`,
        );
    }
    if (
        initialBounds[0] > initialBounds[1] ||
        initialBounds[0] === initialBounds[1] ||
        destinationBounds[0] > destinationBounds[1]
    ) {
        throw new RangeError(
            `Bounds must be like [min, max], not initial: [${
                initialBounds.join(', ')
            }], destination: [${destinationBounds.join(', ')}]`,
        );
    }
    if (destinationBounds[0] === destinationBounds[1]) {
        return destinationBounds[0];
    }
    if (
        typeof value === 'number' && typeof initialBounds[0] === 'number' &&
        typeof initialBounds[1] === 'number' &&
        typeof destinationBounds[0] === 'number' &&
        typeof destinationBounds[1] === 'number'
    ) {
        return (value - initialBounds[0]) *
                (destinationBounds[1] - destinationBounds[0]) /
                (initialBounds[1] - initialBounds[0]) +
            destinationBounds[0] as T;
    }
    if (
        typeof value === 'bigint' && typeof initialBounds[0] === 'bigint' &&
        typeof initialBounds[1] === 'bigint' &&
        typeof destinationBounds[0] === 'bigint' &&
        typeof destinationBounds[1] === 'bigint'
    ) {
        return (value - initialBounds[0]) *
                (destinationBounds[1] - destinationBounds[0]) /
                (initialBounds[1] - initialBounds[0]) +
            destinationBounds[0] as T;
    }
    throw new TypeError(
        `Type mismatch, all value must have the same primitive type and extend bigint or number, {value ${value}:${typeof value}, initialBounds ${initialBounds}:[${typeof initialBounds[
            0
        ]}, ${typeof initialBounds[
            1
        ]}], destinationBounds ${destinationBounds}:[${typeof destinationBounds[
            0
        ]}, ${typeof destinationBounds[1]}]}`,
    );
}
