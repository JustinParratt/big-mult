import {
  giantMult,
  dot,
  sampleColumn,
  sampleRow,
  Scalar,
  Vector,
  Matrix,
  ScalarTransform
} from "../mult";

function vectorSum(vec: Vector): Scalar {
  return vec.reduce<Scalar>((accum, val) => accum + val, 0);
}

describe("sampling functions", () => {
  it("should sample the right column", () => {
    const m: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const f: ScalarTransform = n => 1;
    expect<Scalar>(vectorSum(sampleColumn(m, f))).toBe(15);
  });

  it("should sample the right row", () => {
    const m: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const f: ScalarTransform = n => 2;
    expect<Scalar>(vectorSum(sampleRow(m, f))).toBe(18);
  });
});

describe("matrix helpers", () => {
    it("should dot correctly", () => {
        const x: Vector = [1,2,3];
        const y: Vector = [4,5,6];
        expect<Scalar>(dot(x,y)).toBe(32);
    })
})

describe("giant mult", () => {
  it("should be equal", () => {
    const a: Matrix = [];
    const b: Matrix = [];
    expect<Matrix>(giantMult(a, b)).not.toBeNull("unimplemented");
  });
});
