import { World } from "./World";

export class Updater {
  public world: World;
  constructor(world: World) {
    this.world = world;
  }

  public update(t: number): void {
    Object.values(this.world.solids).forEach(solid => {
      solid.translate(solid.speed.scale(t));
    });

    // TODO check for impacts and adjust velocity accordingly
  }
}
