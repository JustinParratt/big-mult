import {
  giantMult,
  dot,
  selectColumn,
  selectRow,
  scalePKs,
  transpose,
  vectorSum,
  weightedSampleIndex,
  Scalar,
  Probability,
  ProbabilityVector,
  Vector,
  Matrix,
  ScalarTransform,
  probabilityVectorSum,
  ProbabilityGenerator
} from "../mult";

describe("sampling functions", () => {
  it("should sample the right column", () => {
    const m: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const f: ScalarTransform = n => 1;
    expect<Scalar>(vectorSum(selectColumn(m, f))).toBe(15);
  });

  it("should sample the right row", () => {
    const m: Matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const f: ScalarTransform = n => 2;
    expect<Scalar>(vectorSum(selectRow(m, f))).toBe(18);
  });

  it("should sample index from pks correctly", () => {
    const x: ProbabilityVector = [0.2, 0.4, 0.4];
    const f: ProbabilityGenerator = () => 0.3;
    expect<Scalar>(weightedSampleIndex(x, f)).toBe(1);
  });
});

describe("matrix helpers", () => {
  it("should sum scalar array correctly", () => {
    const x: Vector = [1, 2, 3];
    expect<Scalar>(vectorSum(x)).toBe(6);
  });

  it("should sum probabilities correctly", () => {
    const x: ProbabilityVector = [1.5, 2.0, 3.25];
    expect<Probability>(probabilityVectorSum(x)).toBe(6.75);
  });

  it("should dot correctly", () => {
    const x: Vector = [1, 2, 3];
    const y: Vector = [4, 5, 6];
    expect<Scalar>(dot(x, y)).toBe(32);
  });

  it("should transpose correctly", () => {
    const a: Matrix = [[1, 2], [3, 4]];
    expect<Scalar>(transpose(a)[0][0]).toBe(1);
    expect<Scalar>(transpose(a)[1][0]).toBe(2);
    expect<Scalar>(transpose(a)[0][1]).toBe(3);
    expect<Scalar>(transpose(a)[1][1]).toBe(4);
  });

  it("should scale pks correcty", () => {
    const a: Matrix = [[1, 1], [2, 2]];
    const b: Matrix = [[2, 2], [4, 4]];
    // a(;1)*b(1;) = [1,1]*[2,4] = 6
    // a(;2)*b(2;) = [2,2]*[2,4] = 12
    // p = [6/18, 12/18] = [1/3, 2/3];
    expect<Probability>(scalePKs(a, b)[0]).toBe(1 / 3);
    expect<Probability>(scalePKs(a, b)[1]).toBe(2 / 3);
  });
});

describe("giant mult", () => {
  it("should be equal", () => {
    const a: Matrix = [];
    const b: Matrix = [];
    expect<Matrix>(giantMult(a, b)).not.toBeNull("unimplemented");
  });
});
