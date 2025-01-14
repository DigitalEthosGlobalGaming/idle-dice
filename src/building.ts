import * as ex from "excalibur";
import { GridSpace } from "./grid-system/grid-space";
import { Level } from "./level";

export class Building extends ex.Actor {
  tickRate = -1;
  lastTick = -1;
  get gridSpace(): GridSpace {
    if (this.parent instanceof GridSpace) {
      return this.parent;
    }
    throw new Error("parent is not a grid space");
  }
  get level() {
    if (this.scene instanceof Level) {
      return this.scene;
    }
    throw new Error("Scene is not a level");
  }
  private _color: ex.Color = ex.Color.White;

  get color(): ex.Color {
    return this._color;
  }

  set color(value: ex.Color) {
    this._color = value;
    let currentGraphics = this.graphics.current;
    if (currentGraphics instanceof ex.Sprite) {
      currentGraphics.tint = value;
    }
  }

  _spriteImage?: ex.ImageSource;

  set spriteImage(value: ex.ImageSource | undefined) {
    if (value == undefined) {
      this._spriteImage = undefined;
      return;
    }
    const sprite = ex.Sprite.from(value);
    sprite.destSize = {
      width: 24,
      height: 24,
    };
    this.graphics.add("empty", sprite);
    this.graphics.use("empty");
  }

  get spriteImage() {
    return this._spriteImage;
  }

  constructor() {
    const width = 24;
    const height = 24;
    super({
      width: width,
      height: height,
    });
  }

  getNeighbors() {
    return this.gridSpace.getNeighbors();
  }

  onPreUpdate(_engine: ex.Engine, _elapsed: number): void {
    if (this.tickRate > 0) {
      const now = new Date().getTime();

      if (this.lastTick == -1) {
        this.lastTick = now;
      } else {
        if (now - this.lastTick >= this.tickRate) {
          this.lastTick = now;
          this.onTick(now);
        }
      }
    }
  }

  onTick(_delta: number) {}

  onBuild() {}
  onTrigger() {}
}
