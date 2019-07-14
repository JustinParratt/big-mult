# big-mult

Extremely fast, low error, sampling based matrix multiplaction algorithm for giant matrices. Implemented in [AssemblyScript](https://docs.assemblyscript.org/) and
tested with [as-pect](https://github.com/jtenner/as-pect);


## Usage

import `giantMult` and use it like a promise (since we need to stream the wasm file from the node_modules folder).


```javascript
import { giantMult } from "wasm-big-mult";

const a = [[1,2], [1,2], [1,2], [1,2], [1,2]];
const b = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]];
const samples = 3;

giantMult(a, b, samples).then(resultMatrix => console.log(resultMatrix));

```

### Note
In this example, a is a 5x2 matrix and b is a 2x5, the result is a 5x5 matrix.
functionality **is not** defined when the dimensions of a and b are not valid.
I will make it throw an error in future iterations.

## Warnings

Parcel does not support assemblyscript, please use webpack if you wish to use this package.


## Credits

 - Algorithm: [Hopcroft's book, section 7.2.1](http://www.cs.cornell.edu/courses/cs4850/2014sp/book.pdf)