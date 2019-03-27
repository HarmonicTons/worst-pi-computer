import logger from "./helpers/logger";
import newtonCradle from "./scenes/newtonCradle";
import pi from "./scenes/pi";

/**
 * Main process
 */
async function main() {
  logger.info("Start");

  await pi(4);
  // await newtonCradle();

  logger.info("End");
}

main();
