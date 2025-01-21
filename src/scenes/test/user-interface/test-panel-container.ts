import * as ex from "excalibur";
import { Panel, PanelBackgrounds } from "@src/ui/panel";

export class TestPanelContainer extends Panel {
    isSetup: boolean = false;
    onAdd(engine: ex.Engine): void {
        super.onAdd(engine);
        this.background = PanelBackgrounds.ButtonSquareFlat;
    }

    setup() {

    }
    onRender(): void {
        super.onRender();
        this.size = this.screenSize.scale(0.9);
        this.pos = this.screenSize.scale(0.5);
        this.setup();
    }
}