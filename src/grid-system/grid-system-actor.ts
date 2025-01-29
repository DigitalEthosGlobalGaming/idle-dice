import * as ex from "excalibur";
import { Grid } from "@src/grid-system/../graphics/grid";
import { GridSpace } from "./grid-space";
import { GridSystem } from "./grid-system";
import {
  InputHandler,
  InputManager,
} from "@src/grid-system/../input/input-manager";
import { Player } from "@src/grid-system/../player-systems/player";
import { GameScene } from "@src/grid-system/../scenes/game.scene";
import { Resources } from "@src/grid-system/../resources";
import { ExtendedPointerEvent } from "@src/grid-system/../input/extended-pointer-event";

class GridSpaceGhost extends ex.Actor {
  spaceSize: ex.Vector = new ex.Vector(32, 32);
  isGraphicsSetups = false;
  protected _visible = false;
  get visible() {
    return this._visible;
  }
  set visible(value: boolean) {
    if (this._visible == value) {
      return;
    }
    this._visible = value;
    this.setupGraphics();
    if (value) {
      this.graphics.use("hover");
    } else {
      this.graphics.use("hide");
    }
  }
  constructor(size: ex.Vector) {
    super();
    this.spaceSize = size;
  }

  setupGraphics() {
    if (this.isGraphicsSetups) {
      return;
    }
    this.graphics.add(
      "hide",
      new ex.Rectangle({
        width: 0,
        height: 0,
        color: ex.Color.Green,
      })
    );
    const sprite = ex.Sprite.from(Resources.ResizeDCrossDiagonal);
    sprite.destSize = {
      width: this.spaceSize.x * 1.2,
      height: this.spaceSize.y * 1.2,
    };
    sprite.opacity = 0.5;
    this.graphics.add("hover", sprite);
    this.graphics.use("hide");
  }
}

export class DiceGameGridSystem extends GridSystem implements InputHandler {
  private _highlightedSpace: GridSpace | null = null;
  showGhost = false;

  get highlightedSpace(): GridSpace | null {
    return this._highlightedSpace;
  }

  set highlightedSpace(space: GridSpace | null) {
    if (this._highlightedSpace != space) {
      this._highlightedSpace = space;
      if (!this.showGhost) {
        this.ghost.visible = false;
        return;
      }
      if (space != null) {
        this.ghost.visible = true;
        this.ghost.pos = space.pos;
      } else {
        this.ghost.visible = false;
      }
    }
    if (this.player != null) {
      this.player.highlightedSpace = space;
    }
  }
  ghost!: GridSpaceGhost;

  get level(): GameScene {
    if (this.scene instanceof GameScene) {
      return this.scene;
    }

    throw new Error("Scene is not a Level");
  }
  get player(): Player | null {
    if (this.level.player == null) {
      return null;
    }
    return this.level.player;
  }

  onPointerLeave(_evt: ExtendedPointerEvent): void {
    this.highlightedSpace = null;
  }

  onPointerUp(evt: ExtendedPointerEvent): void {
    let space = this.getSpaceFromWorldPosition(evt.worldPos);
    if (space != null) {
      this.player?.onSpaceClicked(space);
    }
  }

  onPointerMove?(evt: ExtendedPointerEvent): void {
    let space = this.getSpaceFromWorldPosition(evt.worldPos);
    if (evt.pointerType == "Mouse") {
      this.showGhost = true;
    } else {
      this.showGhost = false;
    }
    this.highlightedSpace = space;
  }

  collides(vec: ex.Vector): boolean {
    let bounds = this.getBounds();
    return bounds.contains(vec);
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    InputManager.register(this);
    if (this.ghost == null) {
      this.ghost = new GridSpaceGhost(this.spaceSize);
      this.addChild(this.ghost);
      this.ghost.visible = false;
    }
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
