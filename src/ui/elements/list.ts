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
    return size;
  }

  get totalHeight(): number {
    let totalSize: number = 0;
    const childPanels = this.getChildrenPanels();
    let lastChildHeight = 0;
    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];
      totalSize += child.size.y + this.spacing;
      lastChildHeight = child.height;
    }
    return totalSize + lastChildHeight;
  }

  onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.on("childadded", () => {
      this.updatePositions();
    });
  }

  updatePositions(): void {
    const childPanels = this.getChildrenPanels();
    let totalSize: number = 0;

    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];
      totalSize += child.size.y;
    }

    for (let i = 0; i < childPanels.length; i++) {
      const child = childPanels[i];
      let yPos = (this.size.y - totalSize) / 2;
      yPos = yPos + child.size.y * i + this.spacing * i;
      if (child.pos.y != yPos) {
        child.pos = new ex.Vector(child.pos.x, yPos);
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
