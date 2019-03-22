import { ICoordinates } from "../interfaces/ICoordinates";
import { IPolarEquation } from "../interfaces/IPolarEquation";
import { Surface } from "./Surface";
import { Vector } from "./Vector";

export class Solid {
  public density: number;
  public speed: Vector;
  public surface: Surface;

  /**
   * Return a solid
   * @param w wrapper
   * @param w.origin point d'origine
   * @param w.density density
   * @param w.speed speed
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
    this.surface = new Surface({ polarEquation, origin });
    this.density = density;
    this.speed = new Vector({ coordinates: speed });
  }

  get mass(): number {
    return this.surface.area * this.density;
  }
}
