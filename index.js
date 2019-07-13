/**
 * Javascript wrapper around our assemblyscript module, handles passing in the matrix as a flat array.
 */
import { readFileSync } from "fs";
const loader = require("assemblyscript/lib/loader");
const { instantiateBuffer } = loader;

const wasmModule = instantiateBuffer(
  readFileSync("../node_modules/wasm-big-mult/build/optimized.wasm")
);

export function giantMult(a, b, s) {
  // ok so what we are gonna do is flatten the array and pass the dimensions then use them to build the result, yeet
  // the bad thing about this is that now we are boundly by roughly million by million arrays since otherwise the flattened verions will exceed 
  // max array size.
  const lenA = a.length;
  const lenB = b.length;
  const memA = wasmModule.__retain(
    wasmModule.__allocArray(wasmModule.INT32ARRAY, a.flat())
  );
  const memB = wasmModule.__retain(
    wasmModule.__allocArray(wasmModule.INT32ARRAY, b.flat())
  );
  try {
    return wasmModule.giantMult(memA, memB, lenA, lenB, s);
  } finally {
    wasmModule.__release(memA);
    wasmModule.__release(memB);
  }
}
