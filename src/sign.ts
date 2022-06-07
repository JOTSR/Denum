/**
 * If the number is less than zero, return -1, otherwise return 1
 * @param {T} n - The number to get the sign of
 * @returns number or bigint sign
 */
export function sign<T extends number | bigint>(n: T): T {
  //@ts-ignore type checking error
  if (n < 0 && typeof n === 'number') return -1;
  //@ts-ignore type checking error
  if (n >= 0 && typeof n === 'number') return 1;
  //@ts-ignore type checking error
  if (n < 0 && typeof n === 'bigint') return -1n;
  //@ts-ignore type checking error
  return 1n;
}
