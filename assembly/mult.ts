/**
 * Implementation of Hopcroft's giant matrix multiplaction by sampling
 */

export type Scalar = i32;
export type Probability = f32;
export type Vector = Scalar[];
export type ProbabilityVector = f32[];
export type Matrix = Vector[];
export type ScalarTransform = (n: Scalar) => Scalar;
export type ProbabilityGenerator = () => Probability;

/**
 * A funciton that sums a vector
 * O(n)
 *
 * TODO: possibly reimplement using loops to be faster for huge vectors
 * @param vec a vector to sum
 */
export function vectorSum(vec: Vector): Scalar {
  return vec.reduce<Scalar>((accum, val) => accum + val, 0);
}

/**
 * A probability typed version of th above sum
 * O(n)
 * @param vec a probability vector
 */
export function probabilityVectorSum(vec: ProbabilityVector): Probability {
  return vec.reduce<Probability>((accum, val) => accum + val, 0.0);
}

/**
 * Functon that returns an integer index k of n where  k in (0, n-1)
 * O(1)
 */
function sample(): Probability {
  return Math.random();
}

/**
 * Samples an index weighted on the values of the pks
 * O(n)
 * @param pkVector the vector of pks
 * @param sampler  a function which generates a float between 0 and 1
 */
export function weightedSampleIndex(
  pkVector: ProbabilityVector,
  sampler: ProbabilityGenerator
): Scalar {
  const len: Scalar = pkVector.length;
  const rand: Probability = sampler();
  let sum: Probability = 0.0;
  for (let i = 0; i < len; ++i) {
    if (rand < sum) {
      return i - 1;
    }
    sum += pkVector[i];
  }
  return len;
}

/**
 * selectColumn
 * @param m a matrix
 * @param f a scalar transformation function which picks the column
 */
export function selectColumn(m: Matrix, f: ScalarTransform): Vector {
  return m[f(m.length)];
}

/**
 * selectRow
 * implemented with for loops to be as fast for huge matrices (map gets slow for million+ entries)
 * O(n)
 * @param m a matrix
 * @param f function to select the row
 */
export function selectRow(m: Matrix, f: ScalarTransform): Vector {
  const len = m.length;
  const height = m[0].length;
  const index = f(height);
  let result: Scalar[] = [];
  for (let i = 0; i < len; ++i) {
    result.push(m[i][index]);
  }
  return result;
}

/**
 * Vector dot product
 * O(n)
 * @param x a vector
 * @param y a vector
 */
export function dot(x: Vector, y: Vector): Scalar {
  let result: Scalar = 0;
  const len: Scalar = x.length;
  for (let i = 0; i < len; ++i) {
    result += x[i] * y[i];
  }
  return result;
}

/**
 * Sometimes we want to do some precomputation in order to avoid unecessary loops
 * O(n^2)
 * @param m a matrix to be transposed
 */
export function transpose(m: Matrix): Matrix {
  const mT: Matrix = [];
  for (let k = 0; k < m[0].length; k++) {
    mT[k] = [];
  }
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[0].length; j++) {
      mT[j][i] = m[i][j];
    }
  }
  return mT;
}

/**
 * create a vector of probabilities that a column/row is chosen for a single random sample
 * O(n)
 * @param a a vector
 * @param b a vector
 */
export function scalePKs(a: Matrix, b: Matrix): ProbabilityVector {
  // tranpose b for easier dotting
  const bT: Matrix = transpose(b);
  // dot all the column/row pairs
  const len: Scalar = a.length;
  const pkVector: ProbabilityVector = [];
  for (let i = 0; i < len; ++i) {
    pkVector[i] = dot(a[i], bT[i]) as Probability;
  }
  // scale them all by their sum
  const pkSum: Probability = probabilityVectorSum(pkVector) as Probability;
  for (let i = 0; i < len; ++i) {
    let pk = pkVector[i];
    pkVector[i] = pk / pkSum;
  }
  return pkVector;
}

/**
 * giantMult returns a low error sampled matrix product AB
 * O(n^2s) where s << n
 * Speedy!
 * @param a The first matrix
 * @param b The second matrix
 */
export function giantMult(a: Matrix, b: Matrix): Matrix {
  return null; //TODO
}
