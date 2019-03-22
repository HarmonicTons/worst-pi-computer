import { ICoordinates } from "../interfaces/ICoordinates";

export class Point {
  public x: number;
  public y: number;
  constructor({ x, y }: ICoordinates) {
    this.x = x;
    this.y = y;
  }
}
