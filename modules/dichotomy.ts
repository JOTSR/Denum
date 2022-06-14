import { round } from '../mod.ts'

type dichotomyOptions = {
    min?: number
    max?: number
    precision?: number
    constants?: Map<'string', number>
}

let antiStackOverflow: number

/**
 * It takes an expression, an expected result, a variable name, and some options, and returns the value
 * of the variable that makes the expression equal to the expected result
 * Make sure to prepend variable and constants names with "$"
 * @example 
 * dichotomy('3 * $x', 8) => 2.666666666666667
 * dichotomy('- ($x ** 2) + 20', 0, 'x', { min: 0 }) => 4.472135954999579
 * dichotomy('- ($x ** 2) + 20', 0, 'x', { max: 0 }) => -4.472135954999579
 * dichotomy('$x ** 2 + $cst', 16, 'x', { min: 0, max: 10, precision: 2, constants: new Map().set('cst', 7) }) => 3
 * dichotomy('Math.cos(2 * $x) + 5', 5 , 'x', {min: 0, max: Math.PI}) => 2.356194490192345
 * @param {string} expression - The expression to evaluate.
 * @param {number} expectedResult - The result you want to find
 * @param [x='x'] - the variable to solve for
 * @param {dichotomyOptions} options - dichotomyOptions
 * @returns the value of x that makes the expression equal to the expected result.
 */
export function dichotomy(
    expression: string,
    expectedResult: number,
    x = 'x',
    options?: dichotomyOptions
): number {
    const {min, max, precision, constants} = Object.assign({
        min: Number.MIN_SAFE_INTEGER + 1,
        max: Number.MAX_SAFE_INTEGER,
        precision: 15,
        constants: new Map()
    }, options) as Required<dichotomyOptions>

    if (!Number.isInteger(precision)) {
        throw new TypeError(`Precision must be an int, ${precision}`);
    }
    if (precision > 15 || precision < 0) {
        throw new RangeError(`Exceed float32 precision, ${precision}`);
    }

    for (const key of constants.keys()) {
        const value = constants.get(key)
        const regexp = new RegExp(`\\$${key}+`, 'g')
        expression = expression.replace(regexp, `(${value})`)
    }

    const moy = (min + max) / 2;

    if (antiStackOverflow === moy) throw new Error(`Unable to converge for ${expression} @ ${moy}`)
    antiStackOverflow = moy
    
    const regexp = new RegExp(`\\$${x}+`, 'g')
    const evaluate = eval(expression.replace(regexp, `(${moy})`));
    const evaluateMin = eval(expression.replace(regexp, `(${min})`));
    const evaluateMax = eval(expression.replace(regexp, `(${max})`));

    const compare = round(evaluate, precision) == expectedResult ? 0 : round(evaluate, precision) > expectedResult ? 1 : -1


    if (compare === 0) {
        return round(moy, precision)
    }
    const sign = Math.sign(evaluateMax - evaluateMin)

    if (sign === compare) {
        return dichotomy(
            expression,
            expectedResult,
            x,
            {min: min, max: moy, precision: precision}
            );
        }

    return dichotomy(
        expression,
        expectedResult,
        x,
        {min: moy, max: max, precision: precision}
    );
}