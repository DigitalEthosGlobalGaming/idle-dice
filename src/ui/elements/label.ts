import * as ex from "excalibur";
import { Panel } from "../panel";


export class Label extends Panel {
    label: ex.Label | null = null;
    _text: string = "";

    get text(): string {
        return this._text ?? "";
    }
    set text(value: string) {
        if (value == "") {
            this.visible = false;
        }
        this._text = value;
        this.dirty = true;
    }

    private _labelAnchor = ex.vec(0, 0);

    get labelAnchor(): ex.Vector {
        return this._labelAnchor;
    }
    set labelAnchor(value: ex.Vector) {
        this._labelAnchor = value;
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
        this.dirty = true;
    }

    constructor(parent: Panel, text: string) {
        super();
        this.text = text;
        parent.addChild(this);
    }


    onRender(): void {
        super.onRender();
        if (this.text == "") {
            this.visible = false;
            return;
        }

        if (this.label == null) {
            this.label = new ex.Label();
            this.addChild(this.label);
        }
        this.label.text = this.text;
        this.label.color = this.color;
        this.label.anchor = this.labelAnchor;
        this.label.font.size = this.fontSize;
    }

    onPreUpdate(engine: ex.Engine, elapsed: number): void {
        if (this.visible) {
            const newWidth = this.label?.getTextWidth() ?? 0;
            if (this.size.x != newWidth) {
                this.size = new ex.Vector(newWidth, this.size.y);
            }
        }
        super.onPreUpdate(engine, elapsed);

    }

}