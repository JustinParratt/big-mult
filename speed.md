The following is a test you can run yourself to verify the performance boost on big matrices that the wasm + sampling gives us

```javascript
import * as React from "react";
import { giantMult, buildMultiplier } from "wasm-big-mult";

// types and stuff
type Vector = i32[];
type Matrix = Vector[];

// the biggest nxn array javascript will let me flatten.
const vec: Vector = [...new Array(1000)].fill(0).map((any, index) => index);
const a: Matrix = [...new Array(1000)].fill(vec);
const b: Matrix = a;

/**
 * A function that measures the speed of promises for us
 */
function measurePromise(fn: () => Promise<any>): Promise<number> {
  let onPromiseDone = () => performance.now() - start;

  let start = performance.now();
  return fn().then(onPromiseDone, onPromiseDone);
}

/**
 * The naive matrix multiplication
 * @param a an mxn matrix
 * @param b an nxp matrix
 */
function slowMult(a: Matrix, b: Matrix): Matrix {
  const m: i32 = a.length;
  const n: i32 = a[0].length;
  const p: i32 = b[0].length;
  const result: Matrix = [];
  for (let i = 0; i < m; ++i) {
    let vec: Vector = [];
    for (let j = 0; j < p; ++j) {
      let sum: i32 = 0;
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
 * Our speed test
 */
export const Test = () => {
  buildMultiplier().then(wasmModule => {
    measurePromise(() => giantMult(wasmModule, a, b, 100)).then(response =>
      console.log(`${response / 1000} seconds, speedy!`)
    );
  });
  measurePromise(() => Promise.resolve(slowMult(b, a))).then(response =>
    console.log(`${response / 1000} seconds, slow :)`)
  );
};
```

On my macbook pro 13" running chrome the above outputs consistently:

```
1.7268299999996088 seconds, slow :)
0.9285750000271946 seconds, speedy!
```

