import { ICoordinates } from "../interfaces/ICoordinates";
import { Solid } from "./Solid";
import { Updater } from "./Updater";

export class World {
  public solids: { [id: string]: Solid };
  public updater: Updater;

  constructor() {
    this.solids = {};
    this.updater = new Updater(this, 1, 1000, 100);
  }

  public addSolid(solid: Solid) {
    this.solids[solid.id] = solid;
  }

  /**
   * Draw the world with ASCII characters
   * @param w wrapper
   * @param w.from bottom left corner
   * @param w.to top left corner
   * @param w.resolution number of characters by unit
   */
  public draw({
    from = {
      x: -1,
      y: -1
    },
    to = {
      x: 1,
      y: 1
    },
    resolution = {
      x: 10,
      y: 5
    }
  }: {
    from?: ICoordinates;
    to?: ICoordinates;
    resolution?: ICoordinates;
  }): string {
    const X = (to.x - from.x) * resolution.x;
    const Y = (to.y - from.y) * resolution.y;
    const matrix = [...Array(Y)].fill([]).map((l, j) =>
      [...Array(X)].fill(0).map((c, i) => {
        const point = {
          x: (i * (to.x - from.x)) / X + from.x,
          y: (j * (to.y - from.y)) / Y + from.y
        };
        return Object.values(this.solids).find(solid =>
          solid.surface.pointIsInside(point)
        );
      })
    );

    return matrix
      .map(line => line.map(val => (val ? val.id[0] : ".")).join(""))
      .reverse()
      .join("\n");
  }
}
