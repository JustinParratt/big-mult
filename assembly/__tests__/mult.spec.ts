import { giantMult, giantDot } from "../mult";

type Matrix = i32[][];

describe("giant dot", () => {
  it("should be zero", () => {
    expect<i32>(giantDot([], [])).toBe(0);
  });
  it("should be nonzero", () => {
    expect<i32>(giantDot([[1]], [[1]])).toBe(1);
  });
});

describe("giant mult", () => {
  it("should be equal", () => {
    const a: Matrix = [];
    const b: Matrix = [];
    expect<Matrix>(giantMult(a,b)).not.toBeNull('unimplemented');
  });
});
