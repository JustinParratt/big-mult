/**
 * Javascript wrapper around our assemblyscript module, handles passing in the matrix as a flat array.
 */
import { readFileSync } from "fs";
const loader = require("assemblyscript/lib/loader");
const { instantiateBuffer } = loader;

export async function buildMultiplier() {
  var memory = new WebAssembly.Memory({ initial: 10, maximum: 1000 });
  const wasmModule = await loader.instantiateStreaming(
    fetch("../node_modules/wasm-big-mult/build/optimized.wasm"),
    {}
  );
  return wasmModule;
}

export function giantMult(wasmModule, a, b, s) {

  // Currently flattening our array to pass it in easily to the wasm module
  // This code will change when i find a better way to do it
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
    const arrayRefs = wasmModule.__getArray(
      wasmModule.giantMult(refA, refB, lenA, lenB, heightA, heightB, s)
    );
    return arrayRefs.map(ref => wasmModule.__getArray(ref));
  } finally {
    wasmModule.__release(refA);
    wasmModule.__release(refB);
  }
}
