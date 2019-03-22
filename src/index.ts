import { Surface } from "./classes/Surface";
import logger from "./helpers/logger";
import { quickDraw } from "./helpers/quickDraw";

/**
 * Main process
 */
async function main() {
  logger.info("Start");

  const s1 = new Surface({
    origin: { x: 0, y: 0 },
    polarEquation: () => 1
  });

  const square = new Surface({
    origin: { x: 0, y: 0 },
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

  logger.info(
    quickDraw({
      from: { x: -1.5, y: -1.5 },
      resolution: 10,
      surface: triangle,
      to: { x: 1.5, y: 1.5 }
    })
  );

  logger.info(JSON.stringify(triangle.barycenter));

  logger.info("End");
}

main();
