import * as ex from "excalibur";
import { Panel } from "@src/ui/panel";

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

  get size(): ex.Vector {
    let size = super.size.clone();
    size.y = this.totalHeight;
    return ex.vec(size.x, size.y);
  }

  get totalHeight(): number {
    let totalSize: number = 0;
    const childPanels = this.getChildrenPanels();
    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];
      totalSize += child.size.y + this.spacing;
    }
    return totalSize;
  }

  onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.on("childadded", () => {
      this.updatePositions();
    });
    this.on("resize", () => {
      this.updatePositions();
    });
  }

  updatePositions(): void {
    const childPanels = this.getChildrenPanels();
    let totalHeight = this.totalHeight;
    let lastPos = -totalHeight / 2;

    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];
      let yPos = lastPos + child.size.y / 2;
      if (child.pos.y != yPos) {
        child.pos = new ex.Vector(child.pos.x, yPos);
      }
      lastPos = lastPos + child.size.y + this.spacing;
    }

    this.calculateSize();
  }

  override render(): void {
    const wasDirty = this.isChildDirty;
    super.render();
    if (wasDirty) {
      this.updatePositions();
    }
  }
}
