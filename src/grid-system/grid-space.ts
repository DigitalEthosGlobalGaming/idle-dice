import * as ex from "excalibur";
import { GridSystem } from "./grid-system";
import { Serializable } from "../systems/save-system";

export class GridSpace extends ex.Actor implements Serializable {
  serializeId?: string | undefined;

  _gridPos: ex.Vector | null = null;
  get gridPos(): ex.Vector | null {
    let index = this._gridIndex;
    if (index == -1) {
      return null;
    }
    if (this._gridPos == null) {
      this._gridPos =
        this.grid?.getSpacePositionFromIndex(this.gridIndex) ?? null;
    }
    return this._gridPos;
  }
  _gridIndex: number = -1;
  get gridIndex(): number {
    return this._gridIndex;
  }

  set gridIndex(newIndex: number) {
    this._gridIndex = newIndex
  }

  get grid(): GridSystem | null {
    if (this.parent instanceof GridSystem) {
      return this.parent;
    }
    throw new Error("GridSpace has no grid");
  }
  private _size = new ex.Vector(32, 32);
  get size(): ex.Vector {
    return this._size;
  }
  set size(newSize: ex.Vector) {
    this._size = newSize;
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

  handleClick: () => void = () => { };

  getBounds(): ex.BoundingBox {
    return new ex.BoundingBox(
      this.globalPos.x,
      this.globalPos.y,
      this.globalPos.x + this.size.x,
      this.globalPos.y + this.size.y
    );
  }

  serialize() {
    return {
      gridIndex: this.gridIndex,
    };
  }
  deserialize(data: any): void {
    this.gridIndex = data.gridIndex;
  }

}
