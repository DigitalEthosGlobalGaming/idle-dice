import * as ex from "excalibur";
import { Grid } from "../graphics/grid";
import { GridSpace } from "./grid-space";
import { GridSystem } from "./grid-system";
import {
  ExtendedPointerEvent,
  InputHandler,
  InputManager,
} from "../input-manager";

class GridSpaceGhost extends ex.Actor {
  spaceSize: ex.Vector = new ex.Vector(32, 32);
  constructor(size: ex.Vector) {
    super();
    this.spaceSize = size;
  }
  onInitialize(): void {
    this.graphics.add(
      "hide",
      new ex.Rectangle({
        width: 0,
        height: 0,
        color: ex.Color.Green,
      })
    );
    const hoveredColor = ex.Color.Red.clone();
    hoveredColor.a = 0.5;
    this.graphics.add(
      "hover",
      new ex.Rectangle({
        width: this.spaceSize.x,
        height: this.spaceSize.y,
        color: hoveredColor,
      })
    );

    this.graphics.use("hover");
  }

  show() {
    this.graphics.use("hover");
  }
  hide() {
    this.graphics.use("hide");
  }
}

export class DiceGameGridSystem extends GridSystem implements InputHandler {
  spaceSize: ex.Vector = new ex.Vector(32, 32);
  private _highlightedSpace: GridSpace | null = null;

  get highlightedSpace(): GridSpace | null {
    return this._highlightedSpace;
  }

  set highlightedSpace(space: GridSpace | null) {
    if (this._highlightedSpace != space) {
      this._highlightedSpace = space;
      if (space != null) {
        this.ghost.show();
        this.ghost.pos = space.pos;
      } else {
        this.ghost.hide();
      }
    }
  }
  ghost!: GridSpaceGhost;

  constructor(size: ex.Vector, spaceSize: ex.Vector) {
    super(size, spaceSize);
  }

  onPointerLeave(_evt: ExtendedPointerEvent): void {
    this.highlightedSpace = null;
  }

  onPointerDown(evt: ExtendedPointerEvent): void {
    let space = this.getSpaceFromWorldPosition(evt.worldPos);
    if (space != null) {
      space.handleClick();
    }
  }
  onPointerMove?(evt: ExtendedPointerEvent): void {
    let space = this.getSpaceFromWorldPosition(evt.worldPos);
    this.highlightedSpace = space;
  }

  collides(vec: ex.Vector): boolean {
    let bounds = this.getBounds();
    return bounds.contains(vec);
  }

  onAdd(): void {
    InputManager.register(this);
  }

  onInitialize(): void {
    this.ghost = new GridSpaceGhost(this.spaceSize);
    this.addChild(this.ghost);
    this.graphics.use(
      new Grid({
        rows: this.size.x,
        columns: this.size.y,
        cellWidth: this.spaceSize.x,
        cellHeight: this.spaceSize.y,
        color: ex.Color.Black,
        thickness: 1,
      })
    );

    for (let i = 0; i < this.size.x; i++) {
      for (let j = 0; j < this.size.y; j++) {
        this.getSpace(new ex.Vector(i, j));
      }
    }
  }

  getSpaceBounds(position: ex.Vector) {
    const x = position.x * this.spaceSize.x;
    const y = position.y * this.spaceSize.y;
    return new ex.BoundingBox(
      this.pos.x + x,
      this.pos.y + y,
      this.pos.x + x + this.spaceSize.x,
      this.pos.y + y + this.spaceSize.y
    );
  }
}
