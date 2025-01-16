import * as ex from "excalibur";
import { Panel } from "../panel";

export class List extends Panel {
  _spacing: number = 0;

  get spacing(): number {
    return this._spacing;
  }
  set spacing(value: number) {
    if (value != this._spacing) {
      this._spacing = value;
    }
    this.dirty = true;
  }
  onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.on("childadded", () => {
      this.dirty = true;
    });
  }

  updatePositions(): void {
    const childPanels = this.getChildrenPanels();
    let currentY = 0;
    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];

      currentY += child.size.y + this._spacing;
      let newPos = ex.vec(0, currentY);
      if (child.pos.x != newPos.x || child.pos.y != newPos.y) {
        child.pos = newPos;
      }
    }
  }

  override render(): void {
    const wasDirty = this.isChildDirty;
    super.render();
    if (wasDirty) {
      this.updatePositions();
    }
  }
}
