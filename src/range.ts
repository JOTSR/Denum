const checkRangeProperties = (
  start: number | bigint,
  end: number | bigint,
  step: number | bigint,
) => {
  if (
    typeof (start) === 'number' && typeof (end) === 'number' &&
    typeof (step) === 'number'
  ) {
    //Testing range definition
    if (!Number.isInteger(Math.round((end - start) / step * 10e12) / 10e12)) {
      throw new RangeError(
        `Invalid step, [${step}] can't reach [${end}] from [${start}]`,
      );
    }
    //Testing range overflow
    if (
      !Number.isFinite(start) && !Number.isFinite(end) && !Number.isFinite(step)
    ) {
      throw new RangeError('Only finite number are allowed');
    }
  }
  if (
    typeof (start) === 'bigint' && typeof (end) === 'bigint' &&
    typeof (step) === 'bigint'
  ) {
    //Testing range definition
    if (((end - start) % step) !== 0n) {
      throw new RangeError(
        `Invalid step, [${step}] can't reach [${end}] from [${start}]`,
      );
    }
  }
  //Testing range direction
  if ((start < end && step < 0) || (start > end && step > 0)) {
    throw new RangeError(
      `Invalid step, [${step}] can't reach [${end}] from [${start}]`,
    );
  }
  //Testing type homogeneity
  if ((typeof (start) !== typeof (end)) || (typeof (start) !== typeof (step))) {
    throw new TypeError('All parameter must be of the same type');
  }
};

function _irange(
  start: number,
  end: number,
  _step?: number,
): IterableIterator<number>;
function _irange(
  start: bigint,
  end: bigint,
  _step?: bigint,
): IterableIterator<bigint>;
function* _irange(
  start: number | bigint,
  end: number | bigint,
  _step?: number | bigint,
): IterableIterator<number | bigint> {
  //Initialize step to 1 and set number|bigint type
  const step = (_step === undefined)
    ? ((typeof (start) === 'bigint')
      ? (start > end) ? -1n : 1n
      : (start > end)
      ? -1
      : 1)
    : _step;
  //Generator<number | bigint, void, unknown>
  checkRangeProperties(start, end, step);

  //Increment mode
  // if (start < end) {
  if ((start < end) || start === end) {
    if (
      typeof (start) === 'bigint' && typeof (end) === 'bigint' &&
      typeof (step) === 'bigint'
    ) {
      for (let index = start; index < end + step; index += step) yield index;
    }
    if (
      typeof (start) === 'number' && typeof (end) === 'number' &&
      typeof (step) === 'number'
    ) {
      for (let index = start; index < end + step; index += step) yield index;
    }
  } //Decrement mode
  else if (start > end) {
    if (
      typeof (start) === 'bigint' && typeof (end) === 'bigint' &&
      typeof (step) === 'bigint'
    ) {
      for (let index = start; index > end + step; index += step) yield index;
    }
    if (
      typeof (start) === 'number' && typeof (end) === 'number' &&
      typeof (step) === 'number'
    ) {
      for (let index = start; index > end + step; index += step) yield index;
    }
  }

  // else throw new Error(`Invalid range definition: [${start}] => [${end}] @[${step}]`)
}

/**
 * Set a iteratable range from a generator function, idea for big range fast and without memory overflow.
 * All parameters must be of the same type
 * @param start Start bound
 * @param end End bound
 * @param _step Increment/Decrement step (default = 1 | 1n)
 */
export const irange = _irange;

function _range(
  start: number | bigint,
  end: number | bigint,
  _step?: number | bigint,
) {
  //Initialize step to 1 and set number|bigint type
  const step = (_step === undefined)
    ? ((typeof (start) === 'bigint')
      ? (start > end) ? -1n : 1n
      : (start > end)
      ? -1
      : 1)
    : _step;

  checkRangeProperties(start, end, step);

  if (
    typeof (start) === 'bigint' && typeof (end) === 'bigint' &&
    typeof (step) === 'bigint'
  ) {
    return new Array(Number((end - start) / step + 1n))
      .fill(1n)
      .map((_, index) => start + BigInt(index) * step) as bigint[];
  }
  if (
    typeof (start) === 'number' && typeof (end) === 'number' &&
    typeof (step) === 'number'
  ) {
    return new Array(Math.round(Math.abs((end - start) / step)) + 1)
      .fill(1)
      .map((_, index) => start + index * step) as number[];
  }
  return [] as typeof start[];
}

/**
 * Return an array based on input range.
 * All parameters must be of the same type
 * @param start Start bound
 * @param end End bound
 * @param _step Increment/Decrement step (default = 1 | 1n)
 * @returns Array of same type of parameters
 */
export const range = _range;
