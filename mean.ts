/**
 * Calculate the arithmetic mean of a 1D set of values and coefficients
 * @param {number[]} values Values to process on
 * @param {number[]} coefficients Coefficients to process on
 * @returns {number} Arithmetic mean of data set
 */
export function mean(values: number[], coefficients: number[]): number;
/**
 * Calculate the arithmetic mean of a 1D set of [value, coefficient]
 * @param {[number, number][]} datas Datas to process on as an array of [value, coefficient]
 * @returns {number} Arithmetic mean of data set
 */
export function mean(datas: [number, number][]): number;
/**
 * Calculate the arithmetic mean of a 1D set of values
 * @param {...number} values Values to process on
 * @returns {number} Arithmetic mean of data set
 */
export function mean(...values: number[]): number;
export function mean(...params: unknown[]) {
  const [values, coeffs] = paramsToValuesCoeffs(params);
  if (coeffs !== undefined) {
    return (
      values.reduce((prev, curr, index) => prev + curr * coeffs[index]) /
      coeffs.reduce((prev, curr) => prev + curr)
    );
  }
  return values.reduce((prev, curr) => prev + curr) / values.length;
}

/**
 * Calculate the geometric mean of a 1D set of values and coefficients
 * @param {number[]} values Values to process on
 * @param {number[]} coefficients Coefficients to process on
 * @returns {number} Geometric mean of data set
 */
export function geometricMean(values: number[], coefficients: number[]): number;
/**
 * Calculate the geometric mean of a 1D set of [value, coefficient]
 * @param {[number, number][]} datas Datas to process on as an array of [value, coefficient]
 * @returns {number} Geometric mean of data set
 */
export function geometricMean(datas: [number, number][]): number;
/**
 * Calculate the geometric mean of a 1D set of values
 * @param {...number} values Values to process on
 * @returns {number} Geometric mean of data set
 */
export function geometricMean(...values: number[]): number;
export function geometricMean(...params: unknown[]): number {
  const [values, coeffs] = paramsToValuesCoeffs(params);
  if (coeffs !== undefined) {
    return (
      values.reduce((prev, curr, index) => prev * curr * coeffs[index]) **
        (1 / coeffs.reduce((prev, curr) => prev + curr))
    );
  }
  return values.reduce((prev, curr) => prev * curr) ** (1 / values.length);
}

/**
 * Calculate the harmonic mean of a 1D set of values and coefficients
 * @param {number[]} values Values to process on
 * @param {number[]} coefficients Coefficients to process on
 * @returns {number} Harmonic mean of data set
 */
export function harmonicMean(values: number[], coefficients: number[]): number;
/**
 * Calculate the harmonic mean of a 1D set of [value, coefficient]
 * @param {[number, number][]} datas Datas to process on as an array of [value, coefficient]
 * @returns {number} Harmonic mean of data set
 */
export function harmonicMean(datas: [number, number][]): number;
/**
 * Calculate the harmonic mean of a 1D set of values
 * @param {...number} values Values to process on
 * @returns {number} Harmonic mean of data set
 */
export function harmonicMean(...values: number[]): number;
export function harmonicMean(...params: unknown[]): number {
  const [values, coeffs] = paramsToValuesCoeffs(params);
  if (coeffs !== undefined) {
    return (
      coeffs.reduce((prev, curr) => prev + curr) /
      values.map((value, index) => 1 / (value * coeffs[index])).reduce((
        prev,
        curr,
      ) => prev + curr)
    );
  }
  return values.length /
    values.map((value) => 1 / value).reduce((prev, curr) => prev + curr);
}

///rrrrr

/**
 * Calculate the quadratic mean of a 1D set of values and coefficients
 * @param {number[]} values Values to process on
 * @param {number[]} coefficients Coefficients to process on
 * @returns {number} Quadratic mean of data set
 */
export function quadraticMean(values: number[], coefficients: number[]): number;
/**
 * Calculate the quadratic mean of a 1D set of [value, coefficient]
 * @param {[number, number][]} datas Datas to process on as an array of [value, coefficient]
 * @returns {number} Quadratic mean of data set
 */
export function quadraticMean(datas: [number, number][]): number;
/**
 * Calculate the quadratic mean of a 1D set of values
 * @param {...number} values Values to process on
 * @returns {number} Quadratic mean of data set
 */
export function quadraticMean(...values: number[]): number;
export function quadraticMean(...params: unknown[]): number {
  const [values, coeffs] = paramsToValuesCoeffs(params);
  if (coeffs !== undefined) {
    return Math.sqrt(
      mean(
        values.map((value) => value ** 2),
        coeffs.map((coeff) => coeff ** 2),
      ),
    );
  }
  return Math.sqrt(mean(...values.map((value) => value ** 2)));
}

function paramsToValuesCoeffs(
  params: unknown[],
): [number[], number[] | undefined] {
  if (is1DNumberArray(params)) {
    checkParams(params);
    return [params, undefined];
  }
  if (is2DNumberArray(params)) {
    const [values, coeffs] = [
      params[0].map((value) => value[0]),
      params[0].map((coeff) => coeff[1]),
    ];
    checkParams(values, coeffs);
    return [values, coeffs];
  }
  if (is2NumberArray(params)) {
    checkParams(...params);
    return params;
  }
  return [[NaN], undefined];
}

function checkParams(values: number[], coefficients?: number[]) {
  if (values.length < 1) {
    throw new RangeError(`Values length must be > 1, not ${values.length}`);
  }
  if (coefficients !== undefined && coefficients.length !== values.length) {
    throw new RangeError(
      `Values and coefficients must be of the same length, not ${values.length} and ${coefficients.length}`,
    );
  }
  if (
    values.includes(NaN) ||
    values.includes(Infinity) ||
    values.includes(-Infinity)
  ) {
    throw new RangeError(`Values must be finite or not NaN`);
  }
  if (
    coefficients !== undefined &&
    (coefficients.includes(NaN) ||
      coefficients.includes(Infinity) ||
      coefficients.includes(-Infinity))
  ) {
    throw new RangeError(`coefficients must be finite or not NaN`);
  }
}

function is1DNumberArray(param: unknown[]): param is number[] {
  return typeof param[0] === 'number';
}

function is2DNumberArray(param: unknown[]): param is [[number, number][]] {
  if (param instanceof Array && param.length === 1) {
    return param[0][0].length === 2 && typeof param[0][0][0] === 'number';
  }
  return false;
}

function is2NumberArray(param: unknown[]): param is [number[], number[]] {
  if (param[0] instanceof Array && param[1] instanceof Array) {
    return (
      typeof param[0][0] === 'number' && typeof param[1][0] === 'number'
    );
  }
  return false;
}
