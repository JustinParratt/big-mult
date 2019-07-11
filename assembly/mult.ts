/**
 * Implementation of Hopcroft's giant matrix multiplaction by sampling
 */

export type Scalar = i32;
export type Probability = f64;
export type Vector = Scalar[];
export type ProbabilityVector = Probability[];
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
 * Matrix addition
 * O(n^2)
 * @param a matrix m*n
 * @param b matrix m*n
 */
export function add(a: Matrix, b: Matrix): Matrix {
  const m: Scalar = a.length;
  const n: Scalar = a[0].length;
  const result: Matrix = [];
  for (let i = 0; i < m; ++i) {
    let vec: Vector = [];
    for (let j = 0; j < n; ++j) {
      vec[j] = a[i][j] + b[i][j];
    }
    result[i] = vec;
  }
  return result;
}

/**
 * The naive matrix multiplication
 * @param a an mxn matrix
 * @param b an nxp matrix
 */
export function mult(a: Matrix, b: Matrix): Matrix {
  const m: Scalar = a.length;
  const n: Scalar = a[0].length;
  const p: Scalar = b[0].length;
  const result: Matrix = [];
  for (let i = 0; i < m; ++i) {
    let vec: Vector = [];
    for (let j = 0; j < p; ++j) {
      let sum: Scalar = 0;
      for (let k = 0; k < n; ++k) {
        sum += a[i][k] * b[k][j];
      }
      vec.push(sum);
    }
    result.push(vec);
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
 * @param s the number of samples
 */
export function giantMult(a: Matrix, b: Matrix, s: Scalar): Matrix {
  // set up the sampled matrices
  const aS: Matrix = [];
  const bTS: Matrix = [];
  // transpose b for easier selecting
  const bT: Matrix = transpose(b);
  // generate and scale the pk vector
  const pKvec: ProbabilityVector = scalePKs(a, b);
  // iterate over S loops O(ns)
  for (let iter = 0; iter < s; ++iter) {
    // sample an i using the pks
    const index = weightedSampleIndex(pKvec, sample);
    // select the i column and row and add them to the sample matrices
    aS.push(a[index]);
    bTS.push(bT[index]);
  }
  // tranpose bTS to bS
  const bS: Matrix = transpose(bTS);
  // multiply the sample matrices and return the result
  return mult(aS, bS);
}
