import { Panel } from "@src/ui/panel";
import * as ex from "excalibur";

export class Label extends Panel {
  _label: ex.Label | null = null;

  get size(): ex.Vector {
    let size = this.label?.font.measureText(this.text);
    return new ex.Vector(size?.width ?? 0, size?.height ?? 0);
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
    this.calculateSize();
    this.updateLabel();
    this.dirty = true;
  }

  get anchor(): ex.Vector { return super.anchor; }

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
    this.calculateSize();
    this.updateLabel();
    this.dirty = true;
  }

  constructor(parent: Panel, text: string) {
    super();
    this.text = text;
    parent.addChild(this);
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
    label.text = this.text;
    label.font.family = "ds-digi";
    label.color = this.color;
    label.font.baseAlign = ex.BaseAlign.Middle;
    label.font.textAlign = ex.TextAlign.Center;
    label.font.size = this.fontSize;
    this._label = label;
  }

  onRender(): void {
    super.onRender();
    let label = this.label;
    label.text = this.text;
    label.font.family = "ds-digi";
    label.color = this.color;
    label.font.size = this.fontSize;

    if (this.text == "") {
      this.visible = false;
      return;
    }
  }
}
