import * as memoize from "memoizee";
import { ICoordinates } from "../interfaces/ICoordinates";
import { IPolarEquation } from "../interfaces/IPolarEquation";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class Surface {
  get barycenter(): Point {
    const baryvectorWithOffset = Vector.add(
      this.integrate({}).baryvector,
      new Vector({ coordinates: this.origin })
    );

    return new Point(baryvectorWithOffset);
  }

  get area(): number {
    return this.integrate({}).area;
  }
  /**
   * Return true if 2 surfaces intersect
   * @param s1 surface 1
   * @param s2 surface 2
   */
  public static intersect(s1: Surface, s2: Surface): boolean {
    const vector = new Vector({ from: s1.origin, to: s2.origin });
    return (
      s1.polarEquation(vector.angle) +
        s2.polarEquation(vector.angle + Math.PI) >=
      vector.length
    );
  }
  public polarEquation: IPolarEquation;
  public origin: Point;

  /**
   * Find the barycenter and the area of part of the surface
   * Memoized function
   * @param w wrapper
   * @param [w.from=0] start angle
   * @param [w.to=2PI] end angle
   * @param [w.nbOfSteps] number of steps for computation
   */
  public integrate = memoize(
    ({
      from = 0,
      to = 2 * Math.PI,
      nbOfSteps = 1000
    }: {
      from?: number;
      to?: number;
      nbOfSteps?: number;
    }): { baryvector: Vector; area: number } => {
      const delta = (to - from) / nbOfSteps;
      const { vector, area } = [...Array(nbOfSteps)]
        .fill(0)
        .map((v, step) => {
          const angle = step * delta + from;
          const v1 = new Vector({
            coordinates: {
              x: this.polarEquation(angle) * Math.cos(angle),
              y: this.polarEquation(angle) * Math.sin(angle)
            }
          });
          const v2 = new Vector({
            coordinates: {
              x: this.polarEquation(angle + delta) * Math.cos(angle + delta),
              y: this.polarEquation(angle + delta) * Math.sin(angle + delta)
            }
          });
          const a =
            (this.polarEquation(angle) *
              this.polarEquation(angle + delta) *
              Math.sin(delta)) /
            2;
          return { vector: Vector.add(v1, v2).scale(a / 3), area: a };
        })
        .reduce(
          ({ vector: sumVector, area: sumArea }, { vector: v, area: a }) => ({
            area: sumArea + a,
            vector: Vector.add(sumVector, v)
          })
        );
      return {
        area,
        baryvector: vector.scale(1 / area)
      };
    },
    {
      normalizer(args) {
        return JSON.stringify(args);
      }
    }
  );

  /**
   * Return a surface
   * @param w wrapper
   * @param w.polarEquation polar equation describing the shape of the surface from the origin point
   * @param w.origin origin point
   */
  constructor({
    polarEquation,
    origin
  }: {
    polarEquation: IPolarEquation;
    origin: ICoordinates;
  }) {
    this.origin = new Point(origin);
    this.polarEquation = polarEquation;
  }

  /**
   * Return true if a point is inside the surface
   * @param point point
   */
  public pointIsInside(point: ICoordinates): boolean {
    const vector = new Vector({ from: this.origin, to: point });
    return this.polarEquation(vector.angle) >= vector.length;
  }

  public translate(translationVector: ICoordinates) {
    this.origin.x += translationVector.x;
    this.origin.y += translationVector.y;
  }

  /**
   * Draw the surface with ASCII characters
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
        return this.pointIsInside(point);
      })
    );

    return matrix
      .map(line => line.map(val => (val ? "#" : ".")).join(""))
      .reverse()
      .join("\n");
  }
}
