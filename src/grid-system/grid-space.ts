import * as ex from "excalibur";
import { GridSystem } from "./grid-system";

export class GridSpace extends ex.Actor {
  _gridPos: ex.Vector | null = null;
  get gridPos(): ex.Vector | null {
    if (this._gridPos == null) {
      this._gridPos =
        this.grid?.getSpacePositionFromWorldPosition(this.globalPos) ?? null;
    }
    return this._gridPos;
  }
  get grid(): GridSystem | null {
    if (this.parent instanceof GridSystem) {
      return this.parent;
    }
    throw new Error("GridSpace has no grid");
  }

  constructor(public size: ex.Vector) {
    super({
      pos: new ex.Vector(0, 0),
      width: size.x,
      height: size.y,
    });
  }

  getNeighbors(): ReturnType<GridSystem["getNeighbors"]> {
    if (this.grid == null) {
      return {
        left: null,
        right: null,
        top: null,
        bottom: null,
      };
    }
    return this.grid.getNeighbors(this);
  }

  handleClick: () => void = () => {};

  getBounds(): ex.BoundingBox {
    return new ex.BoundingBox(
      this.globalPos.x,
      this.globalPos.y,
      this.globalPos.x + this.width,
      this.globalPos.y + this.height
    );
  }
}
