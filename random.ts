/**
 * Genearate a bounded random number
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random number
 */
export const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}

/**
 * Genearate a bounded random integer
 * @param min Minimum value
 * @param max Maximum value 
 * @returns Random interger
 */
export const randomInt = (min: number | BigInt, max: number | BigInt): number | BigInt => {
    //BigInt
    if (typeof(min) == 'bigint' && typeof(max) == 'bigint')
        return BigInt(`0b${(max - min - 1n).toString(2).split('').map(b => Math.random() > Math.random() ? b : '0').join('')}`) + min
    //Number
    if (typeof(min) == 'number' && typeof(max) == 'number')
        return Math.random() * (max - min) + min
    throw new TypeError('Parameters must be of the same type')
}

/**
 * Produce an array filled with random values
 * @param min Minimum value
 * @param max Maximum value
 * @param length Array length
 * @returns Random numbers array
 */
export const randomArray = (min: number, max: number, length: number) => {
    const array = new Array<number>(length).map(_ => random(min, max))
    return array
}

function _randomIntArray (min: number, max: number, length: number): number[]
function _randomIntArray (min: BigInt, max: BigInt, length: number): BigInt[]
/**
 * Produce an array filled with random integers
 * @param min Minimum value
 * @param max Maximum value
 * @param length Array length
 * @returns Rando integers array
 */
function _randomIntArray (min: number | BigInt, max: number | BigInt, length: number) {
    const array = new Array<typeof min>(length).map(_ => randomInt(min, max))
    return array as typeof min[]
}

export const randomIntArray = _randomIntArray