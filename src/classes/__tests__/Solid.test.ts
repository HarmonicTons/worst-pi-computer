import { Solid } from "../Solid";

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
