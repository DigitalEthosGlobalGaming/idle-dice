import * as ex from "excalibur";

export class Building extends ex.Actor {
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

  onBuild() {}
  onTrigger() {}
}
