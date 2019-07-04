import {
  giantMult,
  sampleColumn,
  sampleRow,
  Vector,
  Matrix,
  ScalarTransform
} from "../mult";

function vectorSum(vec: Vector): i32 {
  return vec.reduce<i32>((accum, val) => accum + val, 0);
}

describe("sampling functions", () => {
  it("should sample the right column", () => {
    const m: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const f: ScalarTransform = n => 1;
    expect<i32>(vectorSum(sampleColumn(m, f))).toBe(15);
  });

  it("should sample the right row", () => {
    const m: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const f: ScalarTransform = n => 2;
    expect<i32>(vectorSum(sampleRow(m, f))).toBe(18);
  });
});

describe("giant mult", () => {
  it("should be equal", () => {
    const a: Matrix = [];
    const b: Matrix = [];
    expect<Matrix>(giantMult(a, b)).not.toBeNull("unimplemented");
  });
});
