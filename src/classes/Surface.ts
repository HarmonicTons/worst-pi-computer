import { ICoordinates } from "../interfaces/ICoordinates";
import { IPolarEquation } from "../interfaces/IPolarEquation";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class Surface {
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

  get barycenter(): Point {
    const baryvector = this.baryvector({});
    return new Point(baryvector);
  }

  get area(): number {
    return this.integral({});
  }

  public integral({
    from = 0,
    to = 2 * Math.PI,
    nbOfSteps = 1000
  }: {
    from?: number;
    to?: number;
    nbOfSteps?: number;
  }): number {
    const delta = (to - from) / nbOfSteps;
    return [...Array(nbOfSteps)]
      .fill(0)
      .map((v, step) => {
        const angle = step * delta + from;
        return (
          (this.polarEquation(angle) *
            this.polarEquation(angle + delta) *
            Math.sin(delta)) /
          2
        );
      })
      .reduce((sum, area) => sum + area, 0);
  }

  public baryvector({
    from = 0,
    to = 2 * Math.PI,
    nbOfSteps = 1000
  }: {
    from?: number;
    to?: number;
    nbOfSteps?: number;
  }): Vector {
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
    return Vector.add(
      vector.scale(1 / area),
      new Vector({ coordinates: this.origin })
    );
  }

  public pointIsInside(point: ICoordinates): boolean {
    const vector = new Vector({ from: this.origin, to: point });
    return this.polarEquation(vector.angle) >= vector.length;
  }
}
