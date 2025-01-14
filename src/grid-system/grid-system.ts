import * as ex from "excalibur";
import { GridSpace } from "./grid-space";

export class GridSystem extends ex.Actor {
  spaces: (GridSpace | null)[] = [];
  size: ex.Vector = ex.vec(0, 0);
  spaceSize: ex.Vector = ex.vec(32, 32);

  constructor(size: ex.Vector, spaceSize: ex.Vector) {
    super({
      pos: new ex.Vector(0, 0),
      width: size.x * spaceSize.x,
      height: size.y * spaceSize.y,
    });
    this.setSize(size);
    this.color = ex.Color.Green;
    this.spaceSize = spaceSize;
  }

  setSize(size: ex.Vector) {
    this.size = size;
    this.spaces = new Array(size.x * size.y).fill(null);
  }
  isInBounds(position: ex.Vector) {
    const index = this.getSpaceIndex(position);
    return index >= 0 && index < this.spaces.length;
  }

  getNeighbors(space: GridSpace): {
    left: GridSpace | null;
    right: GridSpace | null;
    top: GridSpace | null;
    bottom: GridSpace | null;
  } {
    const pos = space.gridPos;
    if (pos == null) {
      return {
        left: null,
        right: null,
        top: null,
        bottom: null,
      };
    }
    return {
      left: this.getSpace(new ex.Vector(pos.x - 1, pos.y)),
      right: this.getSpace(new ex.Vector(pos.x + 1, pos.y)),
      top: this.getSpace(new ex.Vector(pos.x, pos.y - 1)),
      bottom: this.getSpace(new ex.Vector(pos.x, pos.y + 1)),
    };
  }

  getSpaceIndex(position: ex.Vector) {
    return position.y * this.size.x + position.x;
  }

  createSpace() {
    return new GridSpace(this.spaceSize);
  }

  public getBounds(): ex.BoundingBox {
    const left = this.globalPos.x;
    const top = this.globalPos.y;
    const right = left + this.width;
    const bottom = top + this.height;
    return new ex.BoundingBox(left, top, right, bottom);
  }

  getSpacePositionFromWorldPosition(position: ex.Vector) {
    const bounds = this.getBounds();
    if (bounds.contains(position)) {
      const x = Math.floor((position.x - this.pos.x) / this.spaceSize.x);
      const y = Math.floor((position.y - this.pos.y) / this.spaceSize.y);
      return new ex.Vector(x, y);
    }
    return null;
  }
  getSpaceFromWorldPosition(position: ex.Vector) {
    return this.getSpace(
      this.getSpacePositionFromWorldPosition(position) ?? new ex.Vector(-1, -1)
    );
  }

  getSpace<T = GridSpace>(position: ex.Vector): T | null {
    if (!this.isInBounds(position)) {
      return null;
    }
    const index = this.getSpaceIndex(position);

    let foundSpace = this.spaces[index];
    if (foundSpace == null) {
      foundSpace = this.createSpace();
      const centerSpace = new ex.Vector(
        this.spaceSize.x / 2,
        this.spaceSize.y / 2
      );
      const pos = new ex.Vector(
        position.x * this.spaceSize.x,
        position.y * this.spaceSize.y
      );
      foundSpace.pos = pos.add(centerSpace);

      this.addChild(foundSpace);
      this.spaces[index] = foundSpace;
    }

    return foundSpace as T;
  }
}
