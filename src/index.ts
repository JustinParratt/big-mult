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

export async function buildMultiplier() {
  var memory = new WebAssembly.Memory({ initial: 10, maximum: 1000 });
  const wasmModule = await loader.instantiateStreaming(
    fetch("../node_modules/wasm-big-mult/build/optimized.wasm"),
    {}
  );
  return wasmModule;
}

export async function giantMult(wasmModule, a, b, s) {

  // ok so what we are gonna do is flatten the array and pass the dimensions then use them to build the result, yeet
  // the bad thing about this is that now we are boundly by roughly million by million arrays since otherwise the flattened verions will exceed
  // max array size.
  const heightA = a[0].length;
  const heightB = b[0].length;
  const flatA = a.flat();
  const flatB = b.flat();
  const lenA = flatA.length;
  const lenB = flatB.length;
  const refA = wasmModule.__retain(
    wasmModule.__allocArray(wasmModule.INT32ARRAY_ID, flatA)
  );
  const refB = wasmModule.__retain(
    wasmModule.__allocArray(wasmModule.INT32ARRAY_ID, flatB)
  );
  try {
    const result = [];
    const arrayRefs = wasmModule.__getArray(
      wasmModule.giantMult(refA, refB, lenA, lenB, heightA, heightB, s)
    );
    return arrayRefs.map(ref => wasmModule.__getArray(ref));
  } finally {
    wasmModule.__release(refA);
    wasmModule.__release(refB);
  }
}
