import { Solid } from "./Solid";
import { Surface } from "./Surface";
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
  private maxFPS: number;
  private updaterHistoryLength: number;

  constructor(
    world: World,
    updaterTimeSpeed = 1,
    maxFPS = 120,
    updaterHistoryLength = 100
  ) {
    this.world = world;
    this.isRunning = false;
    this.command = false;
    this.updaterTimeSpeed = updaterTimeSpeed;
    this.updaterHistory = [] as IHistoryElement[];
    this.maxFPS = maxFPS;
    this.updaterHistoryLength = updaterHistoryLength;
  }

  get FPS(): number {
    return (
      (1000 * this.updaterHistory.length) /
      this.updaterHistory.reduce((sum, curr) => sum + curr.interval, 0)
    );
  }

  get duration(): number {
    return (
      this.updaterHistory.reduce((sum, curr) => sum + curr.duration, 0) /
      this.updaterHistory.length
    );
  }

  public start(): void {
    this.command = true;
    this.lastUpdateTS = Date.now();
    setImmediate(() => this.update());
  }

  public stop(): void {
    this.command = false;
    this.updaterHistory = [] as IHistoryElement[];
  }

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

  private update(): void {
    this.isRunning = true;
    const updateStartTS = Date.now();
    const timeInMs =
      (updateStartTS - this.lastUpdateTS) * this.updaterTimeSpeed;
    if (timeInMs < 1000 / this.maxFPS) {
      if (this.command) {
        setImmediate(() => this.update());
      }
      return;
    }

    // Move every object
    const solids = Object.values(this.world.solids);
    solids.forEach(solid => {
      solid.translate(Vector.multiply(solid.speed, timeInMs / 1000));
    });

    // Check for impacts and adjust velocity accordingly
    const impacts: Array<[Solid, Solid]> = [];
    solids.forEach((s1, i) => {
      solids.slice(i + 1).forEach(s2 => {
        if (Surface.intersect(s1.surface, s2.surface)) {
          impacts.push([s1, s2]);
        }
      });
    });

    // TODO adjust velocity

    this.postUpdate(updateStartTS);
  }
}
