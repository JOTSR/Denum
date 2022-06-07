import { assertEquals } from '../deps.ts';
import { randomArray, randomInt } from './random.ts';
import { median, quantile } from './median.ts';

Deno.test({
  name: 'It should return the given quantile',
  fn: () => {
    //Quantile
    const ceil = randomInt(0, 100);
    const valuesMin = randomArray(-1000, 0, ceil);
    const valuesMax = randomArray(1, 1000, 100 - ceil);
    const realQuantile = valuesMin.sort((a, b) => a - b).at(-1);
    const values = [...valuesMax, ...valuesMin].sort((_) => randomInt(-1, 1));
    assertEquals(
      quantile(values, ceil / 100),
      realQuantile,
      `Quantile ${ceil} (${realQuantile}) == ${quantile(values, ceil / 100)}`,
    );
    //Median
    assertEquals(
      quantile(values, 0.5),
      median(...values),
      `Median is ${quantile(values, 0.5)}) == ${median(...values)}`,
    );
  },
});
