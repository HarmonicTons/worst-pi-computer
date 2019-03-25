import { v4 as uuidv4 } from "uuid";
import { ICoordinates } from "../interfaces/ICoordinates";
import { IPolarEquation } from "../interfaces/IPolarEquation";
import { Surface } from "./Surface";
import { Vector } from "./Vector";

export class Solid {
  /**
   * Mass in kg
   */
  get mass(): number {
    return this.surface.area * this.density;
  }

  /**
   * Kinetic energy in J
   */
  get kineticEnergy(): number {
    return (this.mass * this.speed.size ** 2) / 2;
  }

  /**
   * Check if 2 solids are impacting
   * @param s1 solid 1
   * @param s2 solid 2
   */
  public static checkForImpact(s1: Solid, s2: Solid): boolean {
    if (!Surface.intersect(s1.surface, s2.surface)) {
      return false;
    }
    const xAxis =
      (s1.surface.barycenter.x < s2.surface.barycenter.x &&
        s1.speed.x > s2.speed.x) ||
      (s2.surface.barycenter.x < s1.surface.barycenter.x &&
        s2.speed.x > s1.speed.x);

    const yAxis =
      (s1.surface.barycenter.y < s2.surface.barycenter.y &&
        s1.speed.y > s2.speed.y) ||
      (s2.surface.barycenter.y < s1.surface.barycenter.y &&
        s2.speed.y > s1.speed.y);

    if (!xAxis && !yAxis) {
      return false;
    }

    Solid.impact(s1, s2, xAxis, yAxis);
    return true;
  }

  /**
   * Adjust the speed of 2 impacting solids
   * @param s1 solid 1
   * @param s2 solid 2
   */
  private static impact(
    s1: Solid,
    s2: Solid,
    xAxis: boolean,
    yAxis: boolean
  ): void {
    // s1 must be lightest
    if (s2.mass < s1.mass) {
      return Solid.impact(s2, s1, xAxis, yAxis);
    }

    const v1 = new Vector({ coordinates: s1.speed });
    const v2 = new Vector({ coordinates: s2.speed });

    if (xAxis) {
      v1.x = s2.speed.x;
      let sign = Math.sign(s2.speed.x);
      if (s1.mass * s1.speed.x ** 2 >= s2.mass * s2.speed.x ** 2) {
        sign = Math.sign(s1.speed.x);
      }
      v2.x =
        sign *
        Math.sqrt(
          s2.speed.x ** 2 -
            (s1.mass / s2.mass) * (s2.speed.x ** 2 - s1.speed.x ** 2)
        );
    }

    if (yAxis) {
      v1.y = s2.speed.y;
      let sign = Math.sign(s2.speed.y);
      if (s1.mass * s1.speed.y ** 2 >= s2.mass * s2.speed.y ** 2) {
        sign = Math.sign(s1.speed.y);
      }
      v2.y =
        sign *
        Math.sqrt(
          s2.speed.y ** 2 -
            (s1.mass / s2.mass) * (s2.speed.y ** 2 - s1.speed.y ** 2)
        );
    }

    s1.speed = v1;
    s2.speed = v2;
  }

  public id: string;
  public density: number;
  public speed: Vector;
  public surface: Surface;

  /**
   * Return a solid
   * @param w wrapper
   * @param w.origin point d'origine
   * @param w.density density in kg/m3
   * @param w.speed speed in m/s
   * @param w.polarEquation polar equation desribing the surface of the solid from origin point
   */
  constructor({
    origin,
    density,
    speed,
    polarEquation
  }: {
    origin: ICoordinates;
    density: number;
    speed: ICoordinates;
    polarEquation: IPolarEquation;
  }) {
    this.id = uuidv4();
    this.surface = new Surface({ polarEquation, origin });
    this.density = density;
    this.speed = new Vector({ coordinates: speed });
  }

  public translate(translationVector: ICoordinates): void {
    return this.surface.translate(translationVector);
  }
}
