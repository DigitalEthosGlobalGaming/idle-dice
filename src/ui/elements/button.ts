import * as ex from "excalibur";
import { Panel } from "../panel";


export type ButtonIcon = {
    imageSource: ex.ImageSource,
    width: number,
    height: number
}
type ButtonOptions = {
    text?: string;
    icon?: ButtonIcon;
    onClick?: (e: ex.PointerEvent) => void;
}
export class Button extends Panel {
    label?: ex.Label;
    iconSprite?: ex.Sprite;
    options!: ButtonOptions;

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

    constructor(parent: Panel, options: ButtonOptions ) {
        super();
        this.options = options;        
        parent.addChild(this);
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
    

    getBounds(): ex.BoundingBox | null {
        const pos = this.pos;
        const width = this.width;
        const height = this.height;
        if (this.label == null && this.options.icon != null) {
            return new ex.BoundingBox(pos.x, pos.y, this.options.icon.width, this.options.icon.height);
        }
        return new ex.BoundingBox(pos.x, pos.y, width, height);
    }

    override onRender(): void {
        const {text,icon} = this.options;
        if (text != '') {
            if (this.label == null) {
                this.label = new ex.Label({
                    text: text,
                    color: ex.Color.White
                });
                this.addChild(this.label);
            }
        }
        if (icon != null) {
            if (this.iconSprite == null) {
                this.iconSprite = ex.Sprite.from(icon.imageSource);
                this.iconSprite.destSize = {
                    width: icon.width,
                    height: icon.height
                };        
                this.graphics.add('default',this.iconSprite);
                this.graphics.use('default');
            }
        }
    }
}