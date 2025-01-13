import * as ex from "excalibur";
import { Panel } from "../panel";


export class Label extends Panel {
    label!: ex.Label;
    text: string;
    constructor(parent: Panel, text: string) {
        super();
        this.text = text;
        parent.addChild(this);
        this.label = new ex.Label({
            text: this.text,
            color: ex.Color.White
        });
        this.addChild(this.label);
    }

    override onRender(): void {
        console.log('t');
    }
}