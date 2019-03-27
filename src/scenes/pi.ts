import { Solid } from "../classes/Solid";
import { World } from "../classes/World";
import logger from "../helpers/logger";
import sleep from "../helpers/sleep";

/**
 * Compute PI counting the number of collisions
 */
export default async function pi(
  numberOfDigits: number,
  watch = true
): Promise<void> {
  const world = new World();

  const s1 = new Solid({
    density: 10 ** (2 * (numberOfDigits - 1)),
    origin: { x: 6, y: 0 },
    polarEquation: () => 1,
    speed: { x: -1, y: 0 }
  });

  world.addSolid(s1);

  const s2 = new Solid({
    density: Infinity,
    origin: { x: 0, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(s2);

  const s3 = new Solid({
    density: 1,
    origin: { x: 4, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(s3);

  world.updater.start();
  let i = 0;
  let lastNumberOfCollisions = 0;
  const estimatedTime = Math.floor(10 ** (numberOfDigits - 4) * Math.PI);
  while (true) {
    i++;
    // adjust simulation speed
    world.updater.updaterTimeSpeed = 1 / (1 + Math.abs(s3.speed.x) / 10);

    // end simulation if PI was found
    if (
      world.updater.totalNumberOfCollisions ===
      Math.floor(Math.PI * 10 ** (numberOfDigits - 1))
    ) {
      break;
    }

    if (watch) {
      const numberOfCollisions =
        world.updater.totalNumberOfCollisions - lastNumberOfCollisions;
      lastNumberOfCollisions = world.updater.totalNumberOfCollisions;
      logger.info(
        "\n" +
          world.draw({
            from: { x: -2, y: -1.5 },
            to: { x: 12, y: 1.5 }
          })
      );
      logger.info(
        `#${i}/${estimatedTime}; collisions: ${
          world.updater.totalNumberOfCollisions
        }; UPS: ${world.updater.UPS}; S1: ${s1.speed.x.toPrecision(
          5
        )}; S3: ${s3.speed.x.toPrecision(
          5
        )}; time : ${world.updater.updaterTimeSpeed.toPrecision(
          5
        )}; collisions/sec: ${numberOfCollisions}`
      );
    }

    await sleep(1000)();
  }
  world.updater.stop();

  logger.info(`#${i}; collisions: ${world.updater.totalNumberOfCollisions}`);
}
