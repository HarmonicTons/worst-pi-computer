import { Solid } from "../classes/Solid";
import { World } from "../classes/World";
import logger from "../helpers/logger";
import sleep from "../helpers/sleep";

/**
 * Simulate a Newton cratle
 */
export default async function newtonCratle(): Promise<void> {
  const world = new World();

  const wall1 = new Solid({
    density: Infinity,
    origin: { x: 0, y: 0 },
    polarEquation: angle =>
      Math.min(Math.abs(1 / Math.cos(angle)), Math.abs(1 / Math.sin(angle))),
    speed: { x: 0, y: 0 }
  });

  world.addSolid(wall1);

  const wall2 = new Solid({
    density: Infinity,
    origin: { x: 20, y: 0 },
    polarEquation: angle =>
      Math.min(Math.abs(1 / Math.cos(angle)), Math.abs(1 / Math.sin(angle))),
    speed: { x: 0, y: 0 }
  });

  world.addSolid(wall2);

  const ball1 = new Solid({
    coefficientOfRestitution: 19 / 20,
    density: 10,
    origin: { x: 5, y: 0 },
    polarEquation: () => 1,
    speed: { x: 2, y: 0 }
  });

  world.addSolid(ball1);

  const ball2 = new Solid({
    coefficientOfRestitution: 19 / 20,
    density: 10,
    origin: { x: 8, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(ball2);

  const ball3 = new Solid({
    coefficientOfRestitution: 19 / 20,
    density: 10,
    origin: { x: 10, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(ball3);

  const ball4 = new Solid({
    coefficientOfRestitution: 19 / 20,
    density: 10,
    origin: { x: 12, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(ball4);

  const ball5 = new Solid({
    coefficientOfRestitution: 19 / 20,
    density: 10,
    origin: { x: 14, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(ball5);

  world.updater.start();
  while (true) {
    logger.info(
      "\n" +
        world.draw({
          from: { x: 0, y: -1.5 },
          resolution: {
            x: 6,
            y: 3
          },
          to: { x: 20, y: 1.5 }
        })
    );

    await sleep(200)();
  }
}
