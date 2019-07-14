/**
 * Javascript wrapper around our assemblyscript module, handles passing in the matrix as a flat array.
 */
import { readFileSync } from "fs";
const loader = require("assemblyscript/lib/loader");
const { instantiateBuffer } = loader;

// Fun fact, this code won't run unless you have a comment containing the word "Buffer".

/*const wasmModule = instantiateBuffer(
  readFileSync("../node_modules/wasm-big-mult/build/optimized.wasm")
);*/

// From a response object, i.e. as returned by window.fetch

export async function giantMult(a, b, s) {
  const wasmModule = await loader.instantiateStreaming(
    fetch("../node_modules/wasm-big-mult/build/optimized.wasm"),
    {}
  );
  console.log(wasmModule);
  // ok so what we are gonna do is flatten the array and pass the dimensions then use them to build the result, yeet
  // the bad thing about this is that now we are boundly by roughly million by million arrays since otherwise the flattened verions will exceed
  // max array size.
  const lenA = a.length;
  const lenB = b.length;
  const flatA = a.flat();
  const flatB = b.flat();
  const refA = wasmModule.__retain(
    wasmModule.__allocArray(wasmModule.I32ARRAY, [1,2,3,4])
  );
  const refB = wasmModule.__retain(
    wasmModule.__allocArray([5,6,7,8])
  );
  try {
    return wasmModule.giantMult(refA, refB, lenA, lenB, s);
  } finally {
    wasmModule.__release(refA);
    wasmModule.__release(refB);
  }
}
