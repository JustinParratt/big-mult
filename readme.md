# big-mult

Extremely fast, low error, sampling based matrix multiplaction algorithm for giant matrices. Implemented in [AssemblyScript](https://docs.assemblyscript.org/) and
tested with [as-pect](https://github.com/jtenner/as-pect);

## Usage

- Import and stream the wasm module using the async function `buildMultiplier`.
- Run giantMult using the module you built.

```javascript
import { giantMult, buildMultiplier } from "wasm-big-mult";

// Trivially small matrices just to show usage
const a = [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2]];
const b = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]];
const samples = 3;

buildMultiplier()
  .then(wasmModule => {
    console.log(giantMult(wasmModule, a, b, samples));
  })
  .catch(err => console.log(err));
```

### Note

Functionality **is not** currently defined when the dimensions of a and b are not valid, the function will throw descriptive errors in future versions

## Warnings

- Parcel does not support assemblyscript, please use webpack if you wish to use this package.
- Due to js memory limitations the biggest matrices supported right now are 1000x1000. WIth some improvements to way this package manages memory the cap will increase in the future.

## Credits

- Algorithm: [Hopcroft's book, section 7.2.1](http://www.cs.cornell.edu/courses/cs4850/2014sp/book.pdf)
