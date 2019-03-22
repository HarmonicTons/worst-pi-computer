import { ICoordinates } from "../interfaces/ICoordinates";

export class Point {
  public x: number;
  public y: number;
  /**
   * Return a point
   * @param w wrapper
   * @param w.x x coordinate
   * @param w.y y coordinate
   */
  constructor({ x, y }: ICoordinates) {
    this.x = x;
    this.y = y;
  }
}
