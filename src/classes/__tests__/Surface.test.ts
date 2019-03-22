import { Surface } from "../Surface";

describe("Point is inside", () => {
  const circle = new Surface({
    origin: { x: 0, y: 0 },
    polarEquation: () => 1
  });

  const square = new Surface({
    origin: { x: 0.5, y: -0.2 },
    polarEquation: angle =>
      Math.min(Math.abs(1 / Math.cos(angle)), Math.abs(1 / Math.sin(angle)))
  });

  test("should return true if point is inside", () => {
    expect(circle.pointIsInside({ x: 0.5, y: 0.5 })).toBe(true);

    expect(square.pointIsInside({ x: 1.4, y: -1.1 })).toBe(true);
  });

  test("should return false if point is outside a circle", () => {
    expect(circle.pointIsInside({ x: 0.9, y: -0.9 })).toBe(false);

    expect(square.pointIsInside({ x: 1.7, y: 1.8 })).toBe(false);
  });

  test("should return true if point is on the surface", () => {
    expect(circle.pointIsInside({ x: 0, y: 1 })).toBe(true);
    expect(circle.pointIsInside({ x: -1, y: 0 })).toBe(true);

    expect(square.pointIsInside({ x: 0.5, y: 0.8 })).toBe(true);
    expect(square.pointIsInside({ x: 1.5, y: 0.3 })).toBe(true);
  });
});

describe("Surfaces intersection", () => {
  test("should return true if 2 solids intersect", () => {
    const circle1 = new Surface({
      origin: { x: 0, y: 0 },
      polarEquation: () => 1
    });

    const circle2 = new Surface({
      origin: { x: 0, y: 0 },
      polarEquation: () => 1
    });

    expect(Surface.intersect(circle1, circle2)).toBe(true);
  });

  test("shoudl return false if 2 solids do not intersect", () => {
    const circle1 = new Surface({
      origin: { x: 0, y: 0 },
      polarEquation: () => 1
    });

    const circle2 = new Surface({
      origin: { x: 1, y: -2 },
      polarEquation: () => 0.3
    });

    expect(Surface.intersect(circle1, circle2)).toBe(false);
  });
});

describe("Surface area", () => {
  const circle = new Surface({
    origin: { x: 0, y: 0 },
    polarEquation: () => 1
  });

  const square = new Surface({
    origin: { x: 0.5, y: -0.2 },
    polarEquation: angle =>
      Math.min(Math.abs(1 / Math.cos(angle)), Math.abs(1 / Math.sin(angle)))
  });

  const triangle = new Surface({
    origin: { x: 0, y: 0 },
    polarEquation: angle => {
      if (angle < Math.PI / 4 || angle > (3 * Math.PI) / 4) {
        return 0;
      }
      return Math.min(
        Math.abs(1 / Math.cos(angle)),
        Math.abs(1 / Math.sin(angle))
      );
    }
  });

  test("get surface area", () => {
    expect(circle.area).toBeCloseTo(Math.PI);

    expect(square.area).toBeCloseTo(4, 1);

    expect(triangle.area).toBeCloseTo(1, 1);
  });

  test("get surface's part area", () => {
    expect(circle.integral({ from: 0, to: Math.PI / 2 })).toBeCloseTo(
      Math.PI / 4
    );
    expect(
      circle.integral({ from: Math.PI / 4, to: (5 * Math.PI) / 4 })
    ).toBeCloseTo(Math.PI / 2);

    expect(
      square.integral({ from: Math.PI / 4, to: (3 * Math.PI) / 4 })
    ).toBeCloseTo(1);
  });
});

describe("Barycenter", () => {
  test("get barycenter of simple surface", () => {
    const circle = new Surface({
      origin: { x: 0.2, y: -0.5 },
      polarEquation: () => 1
    });
    const {
      barycenter: { x, y }
    } = circle;
    expect(x).toBeCloseTo(0.2);
    expect(y).toBeCloseTo(-0.5);
  });

  test("get barycenter of complex surface", () => {
    const square = new Surface({
      origin: { x: 0.2, y: -0.8 },
      polarEquation: angle => {
        if (angle > Math.PI / 2) {
          return 0;
        }
        return Math.min(
          Math.abs(1 / Math.cos(angle)),
          Math.abs(1 / Math.sin(angle))
        );
      }
    });
    const {
      barycenter: { x, y }
    } = square;
    expect(x).toBeCloseTo(0.7);
    expect(y).toBeCloseTo(-0.3);
  });

  test("get baryvector of surface's part", () => {
    const square = new Surface({
      origin: { x: 0.2, y: -0.1 },
      polarEquation: angle =>
        Math.min(Math.abs(1 / Math.cos(angle)), Math.abs(1 / Math.sin(angle)))
    });

    const { x, y } = square.baryvector({ from: 0, to: Math.PI / 2 });
    expect(x).toBeCloseTo(0.7);
    expect(y).toBeCloseTo(0.4);
  });
});
