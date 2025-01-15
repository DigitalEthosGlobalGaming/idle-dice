import * as ex from "excalibur";
import { Panel, PanelBackgrounds } from "../panel";
import { Tooltip } from "../../player-systems/player-tooltip";

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
    tooltip?: Tooltip

    set text(value: string) {
        this.options.text = value;
        if (this.label != null) {
            this.label.text = value;
        }
        this.size = this.calculateSize();
        this.dirty = true;
    }

    set icon(value: ButtonIcon) {
        this.iconSprite = undefined;
        this.options.icon = value;
        this.size = this.calculateSize();
        this.dirty = true;
    }

    constructor(parent: Panel) {
        super(parent);
        this.background = PanelBackgrounds.ButtonSquareFlat;
        this.padding = 10;
    }

    onHoverChanged(e: ex.PointerEvent): void {
        super.onHoverChanged(e);
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
        if (this.options.text != null) {
            
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

                this.addGraphic(this.iconSprite);
            }
        }
        this.size = this.calculateSize();
    }
}
