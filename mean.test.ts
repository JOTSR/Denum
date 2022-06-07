import { assertEquals } from './deps.ts';
import { random, randomArray } from './random.ts';
import { geometricMean, harmonicMean, mean } from './mean.ts';

Deno.test({
  name: 'It should calculate the mean of a datas set',
  fn: () => {
    const realMean = random(1e-4, 5);
    const coefficients = randomArray(1e-4, 1e4, 2e2);
    //Arithmetic
    const arithmeticValues = randomArray(-1e4, 1e4, 1e2).map(
      (rand) => [realMean + rand, realMean - rand],
    ).flat();
    assertEquals(
      mean(...arithmeticValues).toFixed(10),
      realMean.toFixed(10),
      `Calculate the mean ${realMean} on [${
        arithmeticValues.slice(0, 5).join(', ')
      }, ...] gives ${mean(...arithmeticValues)}`,
    );
    assertEquals(
      mean(arithmeticValues, coefficients).toFixed(10),
      mean(arithmeticValues.map((value, index) => [value, coefficients[index]]))
        .toFixed(10),
      `Calculate the mean ${realMean} with coefficients [${
        coefficients.slice(0, 5).join(', ')
      }, ...]`,
    );
    //Geometric
    const geometricValues = randomArray(0, 2, 10).map(
      (rand) => [realMean * rand, realMean / rand],
    ).flat();
    assertEquals(
      geometricMean(...geometricValues).toFixed(10),
      realMean.toFixed(10),
      `Calculate the geometric mean ${realMean} on [${
        geometricValues.slice(0, 5).join(', ')
      }, ...] gives ${geometricMean(...geometricValues)}`,
    );
    assertEquals(
      geometricMean(geometricValues, coefficients.slice(0, 20)).toFixed(10),
      geometricMean(
        geometricValues.map((value, index) => [value, coefficients[index]]),
      ).toFixed(10),
      `Calculate the geometric mean ${realMean} with coefficients [${
        coefficients.slice(0, 5).join(', ')
      }, ...]`,
    );
    //Harmonic
    const harmonicValues = randomArray(1e-4, 1e4, 1e2).map(
      (rand) => [1e3 * realMean / rand, 1e3 * realMean / (2e3 - rand)],
    ).flat();
    assertEquals(
      harmonicMean(...harmonicValues).toFixed(10),
      realMean.toFixed(10),
      `Calculate the harmonic mean ${realMean} on [${
        harmonicValues.slice(0, 5).join(', ')
      }, ...] gives ${harmonicMean(...harmonicValues)}`,
    );
    assertEquals(
      harmonicMean(harmonicValues, coefficients).toFixed(10),
      harmonicMean(
        harmonicValues.map((value, index) => [value, coefficients[index]]),
      ).toFixed(10),
      `Calculate the harmonic mean ${realMean} with coefficients [${
        coefficients.slice(0, 5).join(', ')
      }, ...]`,
    );
  },
});
