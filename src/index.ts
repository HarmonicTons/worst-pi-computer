import { Solid } from "./classes/Solid";
import { Surface } from "./classes/Surface";
import { World } from "./classes/World";
import logger from "./helpers/logger";

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

  logger.info(
    world.draw({
      from: { x: -2, y: -1.5 },
      to: { x: 12, y: 1.5 }
    })
  );
  world.updater.update(1);
  logger.info(
    world.draw({
      from: { x: -2, y: -1.5 },
      to: { x: 12, y: 1.5 }
    })
  );
  world.updater.update(10);
  logger.info(
    world.draw({
      from: { x: -2, y: -1.5 },
      to: { x: 12, y: 1.5 }
    })
  );

  logger.info("End");
}

main();
