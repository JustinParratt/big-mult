/**
 * Implementation of Hopcroft's giant matrix multiplaction by sampling
 */

export type Vector = i32[];
export type Matrix = Vector[];
export type ScalarTransform = (n: i32) => i32;

/**
 * Functon that returns an integer index k of n where  k in (0, n-1)
 * @param n the size of the array to sample
 */
function sampleIndex(n: i32): i32 {
  return Math.round(Math.random() * n);
}

/**
 * sampleColumn
 * @param m a matrix
 * @param f a scalar transformation function which picks the column
 */
export function sampleColumn(m: Matrix, f: ScalarTransform): Vector {
  return m[f(m.length)];
}

/**
 * sampleRow
 * implemented with for loops to be as fast for huge matrices (map gets slow for million+ entries)
 * @param m a matrix
 * @param f function to select the row
 */
export function sampleRow(m: Matrix, f: ScalarTransform): Vector {
  const len = m.length;
  const index = f(len);
  let result: i32[] = [];
  for (let i = 0; i < len; ++i) {
    result.push(m[i][index]);
  }
  return result;
}

/**
 * giantMult returns a low error sampled matrix product AB
 * @param a The first matrix
 * @param b The second matrix
 */
export function giantMult(a: Matrix, b: Matrix): Matrix {
  return null; //TODO
}
