export function map(value: number, initialBounds: [number, number], destinationBounds: [number, number]): number
export function map(value: bigint, initialBounds: [bigint, bigint], destinationBounds: [bigint, bigint]): bigint

/**
 * Re-map a value from initial bounds to another bounds
 * @param value Value to map
 * @param initialBounds [min, max] initial bounds
 * @param destinationBounds [min, max] destination bounds
 * @returns Re-mapped value
 */
export function map(value: number | bigint, initialBounds: [number | bigint, number | bigint], destinationBounds: [number | bigint, number | bigint]): number | bigint {
    if(value < initialBounds[0] || value > initialBounds[1]) {
        throw new RangeError(`Value(${value}) is out of bounds [${initialBounds.join(', ')}]`)
    }
    if (initialBounds[0] > initialBounds[1] || initialBounds[0] === initialBounds[1] || destinationBounds[0] > destinationBounds[1]) {
        throw new RangeError(
            `Bounds must be like [min, max], not initial: [${initialBounds.join(', ')}], destination: [${destinationBounds.join(', ')}]`
        )
    }
    if(destinationBounds[0] === destinationBounds[1]) {
        return destinationBounds[0]
    }
    if (typeof value === "number" && typeof initialBounds[0] === "number" && typeof initialBounds[1] === "number" && typeof destinationBounds[0] === "number" && typeof destinationBounds[1] === "number") {
        return (value - initialBounds[0]) * (destinationBounds[1] - destinationBounds[0])/ (initialBounds[1] - initialBounds[0]) + destinationBounds[0]
    }
    if (typeof value === "bigint" && typeof initialBounds[0] === "bigint" && typeof initialBounds[1] === "bigint" && typeof destinationBounds[0] === "bigint" && typeof destinationBounds[1] === "bigint") {
        return (value - initialBounds[0]) * (destinationBounds[1] - destinationBounds[0]) / (initialBounds[1] - initialBounds[0]) + destinationBounds[0]
    }
    return NaN
}