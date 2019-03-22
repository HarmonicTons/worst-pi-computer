import { ICoordinates } from "../interfaces/ICoordinates";
import { Point } from "./Point";

export class Vector {
  public static add(v1: Vector, v2: Vector): Vector {
    return new Vector({ coordinates: { x: v1.x + v2.x, y: v1.y + v2.y } });
  }
  public x: number;
  public y: number;
  constructor({
    coordinates,
    from,
    to
  }: {
    coordinates?: ICoordinates;
    from?: Point;
    to?: Point;
  }) {
    if (coordinates) {
      this.x = coordinates.x;
      this.y = coordinates.y;
      return;
    }

    this.x = to.x - from.x;
    this.y = to.y - from.y;
  }

  get length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get angle(): number {
    if (this.x >= 0 && this.y >= 0) {
      return Math.atan(this.y / this.x);
    }
    if (this.x >= 0 && this.y <= 0) {
      return 2 * Math.PI - Math.atan(-this.y / this.x);
    }
    if (this.x <= 0 && this.y >= 0) {
      return Math.PI - Math.atan(-this.y / this.x);
    }
    if (this.x <= 0 && this.y <= 0) {
      return (3 * Math.PI) / 2 - Math.atan(this.y / this.x);
    }
  }

  public scale(factor: number): Vector {
    this.x *= factor;
    this.y *= factor;
    return this;
  }
}
