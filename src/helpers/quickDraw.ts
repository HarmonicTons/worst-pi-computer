import { Surface } from "../classes/Surface";
import { ICoordinates } from "../interfaces/ICoordinates";

export const quickDraw = ({
  surface,
  from = {
    x: -1,
    y: -1
  },
  to = {
    x: 1,
    y: 1
  },
  resolution = 20
}: {
  surface: Surface;
  from?: ICoordinates;
  to?: ICoordinates;
  resolution?: number;
}): string => {
  const matrix = [...Array(resolution)].fill([]).map((l, j) =>
    [...Array(resolution)].fill(0).map((c, i) => {
      const point = {
        x: (i * (to.x - from.x)) / resolution + from.x,
        y: (j * (to.y - from.y)) / resolution + from.y
      };
      return surface.pointIsInside(point);
    })
  );

  return matrix
    .map(line => line.map(val => (val ? "##" : "..")).join(""))
    .reverse()
    .join("\n");
};
