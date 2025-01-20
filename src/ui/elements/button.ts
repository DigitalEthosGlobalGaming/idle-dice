import * as ex from "excalibur";
import { Panel, PanelBackgrounds } from "../panel";
import { Tooltip } from "../../player-systems/player-tooltip";
import { Label } from "./label";

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
  label?: Label;
  iconSprite?: ex.Sprite;
  options: ButtonOptions = {};
  _tooltip?: Tooltip;
  get tooltip(): Tooltip | undefined {
    return this._tooltip;
  }
  set tooltip(value: Tooltip | undefined) {
    let oldTooltip = this._tooltip;
    if (value?.code == this.tooltip?.code) {
      return;
    }

    this._tooltip = value;

    if (this.isHovered) {
      if (oldTooltip != null) {
        this.player?.hideTooltip(oldTooltip);
      }

      if (value != null) {
        this.player?.hideTooltip(value);
        this.player?.showTooltip(value);
      }
    }
  }
  hoverColor?: ex.Color;
  originalColor?: ex.Color;

  set text(value: string) {
    this.options.text = value;
    if (this.label != null) {
      this.label.text = value;
    }
    this.dirty = true;
  }

  set icon(value: ButtonIcon) {
    let oldIcon = this.options.icon;
    let newKey = `${value.imageSource.path}-${value.width}-${value.height}`;
    let oldKey = `${oldIcon?.imageSource.path}-${oldIcon?.width}-${oldIcon?.height}`;
    if (newKey == oldKey) {
      return;
    }
    this.iconSprite = undefined;
    this.options.icon = value;
    this.dirty = true;
  }

  set fontSize(value: number) {
    if (this.fontSize == value) {
      return;
    }
    if (this.label != null) {
      this.label.fontSize = value;
    }
    this.dirty = true;
  }
  get fontSize(): number {
    return this.label?.fontSize ?? 0;
  }

  set onClick(value: (e: ex.PointerEvent) => void) {
    this.options.onClick = value;
  }

  constructor(parent: Panel) {
    super(parent);
    this.background = PanelBackgrounds.ButtonSquareFlat;
    this.padding = 10;
  }

  onHoverChanged(e: ex.PointerEvent): void {
    super.onHoverChanged(e);
    if (this.hoverColor != null) {
      if (this.isHovered) {
        this.originalColor = this.color.clone();
        this.color = this.hoverColor;
      } else {
        this.color = this.originalColor ?? this.color;
      }
    }
    if (e.pointerType != "Mouse") {
      this.player?.clearTooltips();
    }
    if (this.tooltip != null) {
      if (this.isHovered) {
        this.player?.showTooltip(this.tooltip);
      } else {
        this.player?.hideTooltip(this.tooltip);
      }
    }
  }

  onPointerDown(_e: ex.PointerEvent): void {
    super.onPointerDown(_e);
    this.emit("button-clicked", _e);
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
    size.x = size.x + (this.label?.size.x ?? 0);
    size.y = size.y + (this.label?.size.y ?? 0);
    return size;
  }

  render(): void {
    let wasDirty = this.dirty;

    super.render();
    if (wasDirty) {
      const newSize = this.calculateSize();
      if (this._size?.x != newSize.x || this._size?.y != newSize.y) {
        this.size = newSize;
      }
    }
  }

  override onRender(): void {
    super.onRender();
    const { text, icon } = this.options ?? {
      text: "Hello world",
    };
    if ((text ?? "") != "") {
      if (this.label == null) {
        this.label = this.addPanel("label", Label);
        this.label.labelAnchor = ex.vec(0.5, 0.5);
      }
      this.label.color = this.color;
      this.label.text = text ?? "";
    }
    if (icon != null) {
      if (this.iconSprite == null) {
        this.iconSprite = ex.Sprite.from(icon.imageSource);
        this.iconSprite.destSize = {
          width: icon.width,
          height: icon.height,
        };
        this.addGraphic(this.iconSprite, new ex.Vector(-32, -32));
      }
    }
  }
}
