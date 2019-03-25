import { Solid } from "./classes/Solid";
import { Surface } from "./classes/Surface";
import { World } from "./classes/World";
import logger from "./helpers/logger";
import sleep from "./helpers/sleep";

/**
 * Main process
 */
async function main() {
  logger.info("Start");

  const world = new World();

  const s1 = new Solid({
    density: 1000,
    origin: { x: 0, y: 0 },
    polarEquation: () => 1,
    speed: { x: 1, y: 0 }
  });

  world.addSolid(s1);

  const s2 = new Solid({
    density: 1000,
    origin: { x: 10, y: 0 },
    polarEquation: () => 1,
    speed: { x: 0, y: 0 }
  });

  world.addSolid(s2);

  world.updater.start();
  for (let i = 0; i < 10; i++) {
    logger.info(
      world.draw({
        from: { x: -2, y: -1.5 },
        to: { x: 12, y: 1.5 }
      })
    );
    logger.info(
      `FPS: ${world.updater.FPS}; duration: ${world.updater.duration}`
    );
    await sleep(1000)();
  }
  world.updater.stop();

  logger.info("End");
}

main();
