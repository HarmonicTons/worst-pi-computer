import logger from "../helpers/logger";
import { Solid } from "./Solid";
import { Vector } from "./Vector";
import { World } from "./World";

interface IHistoryElement {
  duration: number;
  interval: number;
}

export class Updater {
  public world: World;
  public isRunning: boolean;
  public updaterTimeSpeed: number;
  private lastUpdateTS: number;
  private updaterHistory: IHistoryElement[];
  private command: boolean;
  private maxUPS: number;
  private updaterHistoryLength: number;

  /**
   * World Updater
   * @param world world
   * @param [updaterTimeSpeed] speed at which the time goes in simulation comparing to real time
   * @param [maxUPS] target number of Update Per Second
   * @param [updaterHistoryLength] size of the array used to compute UPS
   */
  constructor(
    world: World,
    updaterTimeSpeed = 1,
    maxUPS = 120,
    updaterHistoryLength = 100
  ) {
    this.world = world;
    /**
     * Is the updater currently running an update
     */
    this.isRunning = false;
    /**
     * Switch to turn ON or OFF the updater
     */
    this.command = false;
    this.updaterTimeSpeed = updaterTimeSpeed;
    this.updaterHistory = [] as IHistoryElement[];
    this.maxUPS = maxUPS;
    this.updaterHistoryLength = updaterHistoryLength;
  }

  /**
   * Updates Per Second
   */
  get UPS(): number {
    return (
      (1000 * this.updaterHistory.length) /
      this.updaterHistory.reduce((sum, curr) => sum + curr.interval, 0)
    );
  }

  /**
   * Average duration of one update
   */
  get duration(): number {
    return (
      this.updaterHistory.reduce((sum, curr) => sum + curr.duration, 0) /
      this.updaterHistory.length
    );
  }

  /**
   * Start the updater
   */
  public start(): void {
    this.command = true;
    this.lastUpdateTS = Date.now();
    setImmediate(() => this.update());
  }

  /**
   * Stop the updater
   */
  public stop(): void {
    this.command = false;
    this.updaterHistory = [] as IHistoryElement[];
  }

  /**
   * Post update script
   * Manage Updates history stack & schedule next update
   * @param updateStartTS timestamp at which the update started
   */
  private postUpdate(updateStartTS: number): void {
    const updateEndTS = Date.now();
    const duration = updateEndTS - updateStartTS;
    const interval = updateEndTS - this.lastUpdateTS;
    this.updaterHistory.push({
      duration,
      interval
    });
    this.updaterHistory = this.updaterHistory.slice(-this.updaterHistoryLength);
    this.lastUpdateTS = updateEndTS;
    this.isRunning = false;
    if (this.command) {
      setImmediate(() => this.update());
    }
  }

  /**
   * Update the world
   */
  private update(): void {
    this.isRunning = true;
    const updateStartTS = Date.now();
    /**
     * Time spent since last update
     */
    const realTimeInMs = updateStartTS - this.lastUpdateTS;
    // If not enough time was spent since last update to get to target UPS
    if (realTimeInMs < 1000 / this.maxUPS) {
      // If the updater must still run
      if (this.command) {
        // plan an update latter
        setImmediate(() => this.update());
      }
      // stop updater
      return;
    }

    /**
     * Time spent since last update in the simulation
     */
    const simulationTimeInMs = realTimeInMs * this.updaterTimeSpeed;

    // Move every object
    const solids = Object.values(this.world.solids);
    solids.forEach(solid => {
      solid.translate(Vector.multiply(solid.speed, simulationTimeInMs / 1000));
    });

    // Check for collisions
    const collisions: Array<[Solid, Solid]> = [];
    let nbOfCollisions = 0;
    solids.forEach((s1, i) => {
      solids.slice(i + 1).forEach(s2 => {
        const res = Solid.checkForCollision(s1, s2);
        if (res) {
          nbOfCollisions++;
        }
      });
    });

    if (nbOfCollisions > 0) {
      logger.info(`${nbOfCollisions} collision(s)`);
    }

    this.postUpdate(updateStartTS);
  }
}
