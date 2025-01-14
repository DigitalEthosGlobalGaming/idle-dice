import * as ex from "excalibur";
import { Panel } from "../panel";

export type ButtonIcon = {
  imageSource: ex.ImageSource;
  width: number;
  height: number;
};
type ButtonOptions = {
  text?: string;
  icon?: ButtonIcon;
  onClick?: (e: ex.PointerEvent) => void;
};
export class Button extends Panel {
  label?: ex.Label;
  iconSprite?: ex.Sprite;
  options: ButtonOptions = {};

  private _color: ex.Color = ex.Color.White;

  get color(): ex.Color {
    return this._color;
  }

  set color(value: ex.Color) {
    this._color = value;
    if (this.iconSprite != null) {
      this.iconSprite.tint = value;
    }
    if (this.label != null) {
      this.label.color = value;
    }
  }

  set text(value: string) {
    this.options.text = value;
    if (this.label != null) {
      this.label.text = value;
    }
    this.render();
  }

  set icon(value: ButtonIcon) {
    this.iconSprite = undefined;
    this.options.icon = value;

    this.onRender();
  }

  constructor(parent: Panel) {
    super(parent);
  }

  onHoverChanged(): void {
    this.color ? ex.Color.Gray : ex.Color.White;
  }

  onPointerDown(_e: ex.PointerEvent): void {
    super.onPointerDown(_e);
    if (this.options.onClick != null) {
      this.options.onClick(_e);
    }
  }

  calculateSize(): ex.Vector {
    const width = this.width;
    const height = this.height;
    const size = new ex.Vector(width, height);

    if (this.options.icon != null) {
      size.x = this.options.icon.width;
      size.y = this.options.icon.height;
    }
    return size;
  }

  override onRender(): void {
    super.onRender();
    const { text, icon } = this.options ?? {
      text: "Hello world",
    };
    if (text != "") {
      if (this.label == null) {
        this.label = new ex.Label({
          text: text,
          color: ex.Color.White,
        });
        this.addChild(this.label);
      }
    }
    if (icon != null) {
      if (this.iconSprite == null) {
        this.iconSprite = ex.Sprite.from(icon.imageSource);
        this.iconSprite.destSize = {
          width: icon.width,
          height: icon.height,
        };
        this.graphics.add("default", this.iconSprite);
        this.graphics.use("default");
      }
    }
    this.size = this.calculateSize();
  }
}
