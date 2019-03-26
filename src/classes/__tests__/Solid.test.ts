import { Solid } from "../Solid";
import { Vector } from "../Vector";

test("compute mass", () => {
  const circle = new Solid({
    density: 10,
    origin: { x: 0, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  const square = new Solid({
    density: 4,
    origin: { x: 0.2, y: 1.5 },
    polarEquation: angle =>
      Math.min(Math.abs(1 / Math.cos(angle)), Math.abs(1 / Math.sin(angle))),
    speed: { x: 10, y: -2 }
  });

  expect(circle.mass).toBeCloseTo(10 * Math.PI);
  expect(square.mass).toBeCloseTo(4 * 4);
});

describe("Check for collisions", () => {
  test("should return false if 2 solids do not intersect", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });
    const s2 = new Solid({
      density: 1000,
      origin: { x: 4, y: 0 },
      polarEquation: () => 2,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(false);
  });

  test("should return false if 2 solids intersect but are moving away one from the other", () => {
    let s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });
    let s2 = new Solid({
      density: 1000,
      origin: { x: 1.5, y: 0 },
      polarEquation: () => 2,
      speed: new Vector({ coordinates: { x: 1, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(false);

    s1 = new Solid({
      density: 1000,
      origin: { x: 1.5, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });
    s2 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 2,
      speed: new Vector({ coordinates: { x: -0.5, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(false);

    s1 = new Solid({
      density: 1000,
      origin: { x: 1, y: 1 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 2 } })
    });
    s2 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 2,
      speed: new Vector({ coordinates: { x: -0.5, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(false);

    s1 = new Solid({
      density: 1000,
      origin: { x: 1, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });
    s2 = new Solid({
      density: 1000,
      origin: { x: 0, y: 1 },
      polarEquation: () => 2,
      speed: new Vector({ coordinates: { x: 0, y: 1 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(false);
  });

  test("should return true if 2 solids intersect and are moving toward each other (X axis)", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });
    const s2 = new Solid({
      density: 1000,
      origin: { x: 1.9, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: -1, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(true);
  });

  test("should return true if 2 solids intersect and are moving toward each other (Y axis)", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 1 } })
    });
    const s2 = new Solid({
      density: 1000,
      origin: { x: 0, y: 1.9 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(true);
  });
});

describe("Process collision", () => {
  test("Total Kinetic Energy should not change", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 1, y: 0 } })
    });
    const s2 = new Solid({
      density: 1000,
      origin: { x: 1.9, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: -1, y: 0 } })
    });

    const beforeCollisionKE = s1.kineticEnergy + s2.kineticEnergy;
    expect(Solid.checkForCollision(s1, s2)).toBe(true);
    const afterCollisionKE = s1.kineticEnergy + s2.kineticEnergy;
    expect(beforeCollisionKE).toBeCloseTo(afterCollisionKE);
  });

  test("should transfert speed", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 1, y: 0 } })
    });
    const s2 = new Solid({
      density: 1000,
      origin: { x: 1.9, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 0, y: 0 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(true);
    const { x: x1, y: y1 } = s1.speed;
    expect(x1).toBeCloseTo(0);
    expect(y1).toBeCloseTo(0);

    const { x: x2, y: y2 } = s2.speed;
    expect(x2).toBeCloseTo(1);
    expect(y2).toBeCloseTo(0);
  });

  test("should exchange speed (mass2 = 10 * mass1)", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 1, y: 0.2 } })
    });
    const s2 = new Solid({
      density: 10000,
      origin: { x: 1.3, y: 1.3 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: -0.2, y: -1 } })
    });

    expect(Solid.checkForCollision(s1, s2)).toBe(true);
    const { x: x1, y: y1 } = s1.speed;
    expect(x1).toBeCloseTo(-1.1818);
    expect(y1).toBeCloseTo(-1.9818);

    const { x: x2, y: y2 } = s2.speed;
    expect(x2).toBeCloseTo(0.01818);
    expect(y2).toBeCloseTo(-0.7818);
  });

  test("should work no matter arguments order", () => {
    const s1 = new Solid({
      density: 1000,
      origin: { x: 0, y: 0 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: 1, y: 0.2 } })
    });
    const s2 = new Solid({
      density: 10000,
      origin: { x: 1.3, y: 1.3 },
      polarEquation: () => 1,
      speed: new Vector({ coordinates: { x: -0.2, y: -1 } })
    });

    expect(Solid.checkForCollision(s2, s1)).toBe(true);
    const { x: x1, y: y1 } = s1.speed;
    expect(x1).toBeCloseTo(-1.1818);
    expect(y1).toBeCloseTo(-1.9818);

    const { x: x2, y: y2 } = s2.speed;
    expect(x2).toBeCloseTo(0.01818);
    expect(y2).toBeCloseTo(-0.7818);
  });
});
