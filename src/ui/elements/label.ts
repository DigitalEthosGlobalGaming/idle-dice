import { Panel } from "@src/ui/panel";
import * as ex from "excalibur";

type textAligns = "left" | "center" | "right";
export class Label extends Panel {
  _label: ex.Label | null = null;

  _align: textAligns = "center";

  get align(): textAligns {
    return this._align;
  }
  set align(value: textAligns) {
    if (value == this._align) {
      return;
    }
    this._align = value;
    this.dirty = true;
  }
  get size(): ex.Vector {
    if (this.label == null) {
      this.updateLabel();
    }
    if (this._size == null) {
      this.calculateSize();
    }
    return this._size ?? new ex.Vector(0, 0);
  }
  set size(_value: ex.Vector) {
    throw new Error("Size is read only");
  }

  get label(): ex.Label {
    if (this._label == null) {
      this.updateLabel();
    }
    if (this._label == null) {
      throw new Error("Label not created");
    }
    return this._label;
  }
  _text: string = "";

  get text(): string {
    return this._text ?? "";
  }
  set text(value: string) {
    if (value == "") {
      this.visible = false;
    }
    if (value == this._text) {
      return;
    }
    this._text = value;
    this.updateLabel();
    this.dirty = true;
  }

  get anchor(): ex.Vector {
    return super.anchor;
  }

  set anchor(value: ex.Vector) {
    super.anchor = value;
    this.dirty = true;
  }

  private _fontSize: number = 10;
  get fontSize(): number {
    return this._fontSize;
  }
  set fontSize(value: number) {
    if (value == this._fontSize) {
      return;
    }
    this._fontSize = value;
    this.updateLabel();
    this.dirty = true;
  }

  constructor(parent: Panel | null, text: string) {
    super();
    this.text = text;
    if (parent != null) {
      parent.addChild(this);
    }
  }

  override calculateSize(): void {
    if (this.label == null) {
      this.updateLabel();
    }
    if (this.label == null) {
      return;
    }
    let oldSize = this._size ?? new ex.Vector(0, 0);
    let size = this.label.font.measureText(this.text);
    const nextX = size.width;
    const nextY = size.height;
    if (oldSize.x != nextX || oldSize.y != nextY) {
      this._size = new ex.Vector(nextX, nextY);
      this.dirty = true;
      if (this.parent instanceof Panel) {
        this.parent.calculateSize();
      }
      this.emit("resize", { oldSize, newSize: this.size });
      this.dirty = true;
    }
  }

  adjustFontsizeToWidth(width: number) {
    let label = this.label;
    let currentFontSize = 0;
    let currentWidth = 0;

    while (currentWidth < width) {
      currentFontSize = currentFontSize + 1;
      label.font.size = currentFontSize;
      currentWidth = label.font.measureText(this.text).width;
    }
    this.fontSize = currentFontSize;
  }

  updateLabel() {
    let label = this._label;
    if (label == null) {
      label = new ex.Label({
        font: new ex.Font({
          family: "ds-digi",
        }),
      });
      this.addChild(label);
    }
    let oldData = `${label.text} ${label.font.size}`;
    label.text = this.text;
    label.font.family = "ds-digi";
    label.color = this.color;
    label.font.baseAlign = ex.BaseAlign.Middle;
    label.font.textAlign = ex.TextAlign.Center;
    label.font.size = this.fontSize;
    let newData = `${label.text} ${label.font.size}`;
    this._label = label;
    if (oldData != newData) {
      this.calculateSize();
    }
  }

  onRender(): void {
    super.onRender();
    let label = this.label;
    label.text = this.text;
    label.font.family = "ds-digi";
    label.color = this.color;
    label.font.size = this.fontSize;
    if (this.align == "left") {
      label.pos = ex.vec(-this.halfWidth, this.label.pos.y);
      label.font.textAlign = ex.TextAlign.Left;
    }
    if (this.align == "center") {
      label.pos = ex.vec(0, this.label.pos.y);
      label.font.textAlign = ex.TextAlign.Center;
    }
    if (this.align == "right") {
      label.pos = ex.vec(this.halfWidth, this.label.pos.y);
      label.font.textAlign = ex.TextAlign.Right;
    }
    if (this.text == "") {
      this.visible = false;
      return;
    }
  }
}
