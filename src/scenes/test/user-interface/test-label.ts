import * as ex from "excalibur";
import { Label } from "@src/ui/elements/label";
import { TestPanelContainer } from "./test-panel-container";
import { ExtendedPointerEvent } from "@src/input/extended-pointer-event";

export class TestLabelPanel extends TestPanelContainer {

    setup() {
        let labelSizes = [
            20,
            24,
            32,
            48,
            64
        ];
        let previousY = this.top;
        for (let i = 0; i < labelSizes.length; i++) {
            let label = this.addPanel("label-" + i, Label);
            label.acceptingInputs = true;
            label.text = `Label ${labelSizes[i]}`;
            label.fontSize = labelSizes[i];
            label.pos.y = previousY + label.halfHeight;
            label.pos.x = this.left + label.halfWidth;
            label.onHoverChanged = (_evt: ExtendedPointerEvent) => {
                if (label.isHovered) {
                    label.color = ex.Color.Green;
                } else {
                    label.color = ex.Color.White;
                }
            }
            previousY = previousY + label.size.y + 10;
        }
    }

}