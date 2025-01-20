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
      // this.updatePositions();
      // this.dirty = true;
    });
  }

  updatePositions(): void {
    const childPanels = this.getChildrenPanels();
    let currentY = 0;
    let hasChanged = false;
    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];

      currentY += child.size.y + this._spacing;
      if (child.pos.y != currentY) {
        child.pos.y = currentY;
        child.dirty = true;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.calculateSize();
    }
    this.level.drawDebug(this.globalBounds, this.id);
  }

  override render(): void {
    const wasDirty = this.isChildDirty;

    super.render();
    if (wasDirty) {
      const dirtyPanels = this.dirtyPanels;
      for (const panel of dirtyPanels) {
        console.log(panel.element);
      }
      // console.log(dirtyPanels);
      // this.updatePositions();
    }
  }
}
