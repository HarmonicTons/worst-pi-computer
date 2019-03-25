import { Vector } from "../Vector";

describe("constructor", () => {
  test("should construct from coordinates", () => {
    expect(new Vector({ coordinates: { x: 5, y: -2 } })).toBeInstanceOf(Vector);
  });

  test("should construct from points", () => {
    expect(
      new Vector({ from: { x: 2, y: 3 }, to: { x: -1, y: 6 } })
    ).toBeInstanceOf(Vector);
  });
});

test("should compute length", () => {
  const v1 = new Vector({ coordinates: { x: 1, y: 0 } });
  const v2 = new Vector({ coordinates: { x: 1, y: 1 } });
  const v3 = new Vector({ coordinates: { x: -2, y: 6 } });
  expect(v1.length).toBeCloseTo(1);
  expect(v2.length).toBeCloseTo(Math.sqrt(2));
  expect(v3.length).toBeCloseTo(Math.sqrt(40));
});

test("should compute angle", () => {
  const v1 = new Vector({ coordinates: { x: 1, y: 0 } });
  const v2 = new Vector({ coordinates: { x: 1, y: 1 } });
  const v3 = new Vector({ coordinates: { x: -2, y: 6 } });
  const v4 = new Vector({ coordinates: { x: -2, y: -2 } });
  expect(v1.angle).toBeCloseTo(0);
  expect(v2.angle).toBeCloseTo(Math.PI / 4);
  expect(v3.angle).toBeCloseTo(1.892);
  expect(v4.angle).toBeCloseTo((5 * Math.PI) / 4);
});

test("should add two vectors", () => {
  const v1 = new Vector({ coordinates: { x: 1, y: -1.2 } });
  const v2 = new Vector({ coordinates: { x: -0.5, y: -2 } });

  expect(Vector.add(v1, v2)).toMatchObject({ x: 0.5, y: -3.2 });
});

test("should substract two vectors", () => {
  const v1 = new Vector({ coordinates: { x: 1, y: -1.2 } });
  const v2 = new Vector({ coordinates: { x: -0.5, y: -2 } });

  expect(Vector.substract(v1, v2)).toMatchObject({ x: 1.5, y: 0.8 });
});

test("should multiply a vector and a scalar", () => {
  const v = new Vector({ coordinates: { x: 1, y: -3 } });

  expect(Vector.multiply(v, -5)).toMatchObject({ x: -5, y: 15 });
});
