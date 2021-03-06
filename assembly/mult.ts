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
export type FloatVector = f64[];
export type FloatMatrix = FloatVector[];

// need this so that our memory management code can function
export const INT32ARRAY_ID = idof<Int32Array>();

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
export function sample(): Probability {
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
  return len - 1;
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
  const mTlen: Scalar = m[0].length;
  const mLen: Scalar = m.length;
  for (let k = 0; k < mTlen; k++) {
    mT[k] = [];
    mT[k].length = mLen; // for memory allocation purposes
  }
  for (let i = 0; i < mLen; i++) {
    for (let j = 0; j < mTlen; j++) {
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
 * Not entirely accurate as we round at the end but still pretty close
 * @param bT
 * @param s
 * @param pK
 */
export function scaleRow(
  bTk: Vector,
  s: Scalar,
  pK: Probability
): Vector {
  //B_k = b_k / s*p_k
  let lenB = bTk.length;
  const result: Vector = [];
  const sF: f64 = s as f64;
  for (let j = 0; j < lenB; ++j) {
    let numerator = bTk[j] as f64;
    result[j] = Math.round(numerator / (sF * pK)) as Scalar;
  }

  return result;
}

/**
 * We first need to recreate the array from memory and then turn it back into a matrix
 * @param flat
 * @param len
 * @param height
 */
export function unFlatten(flat: Vector, len: Scalar, height: Scalar): Matrix {
  let result: Matrix = [];
  let copy: Vector = [];
  for (let i = 0; i < len; ++i) {
    copy.push(flat[i]);
  }
  if (copy.length % height != 0) {
    return [];
  }
  while (copy.length > 0) {
    result.push(copy.splice(0, height));
  }
  return result;
}

/**
 * Have to pass in this way to deal with memory.
 * a: mxn
 * b: nxp
 * O(mps) where is is a constant << n
 * @param flatA
 * @param flatB
 * @param heightA
 * @param heightB
 * @param s
 */
export function giantMult(
  flatA: Vector,
  flatB: Vector,
  lenA: Scalar,
  lenB: Scalar,
  heightA: Scalar,
  heightB: Scalar,
  s: Scalar
): Matrix {
  // unflatten appears to be broken
  const a: Matrix = unFlatten(flatA, lenA, heightA);
  const b: Matrix = unFlatten(flatB, lenB, heightB);
  const aS: Matrix = [];
  const bTS: Matrix = [];
  // we transpose here for easier sample matrix building but if we could do that without transposing wed get a performance boost
  const bT: Matrix = transpose(b);
  const pKvec: ProbabilityVector = scalePKs(a, b);
  for (let iter = 0; iter < s; ++iter) {
    const index = weightedSampleIndex(pKvec, sample);
    aS.push(a[index]);
    const scaledBTK = scaleRow(bT[index],s,pKvec[index]);
    bTS.push(scaledBTK);
  }
  const bS: Matrix = transpose(bTS);
  return mult(bS, aS);
}
