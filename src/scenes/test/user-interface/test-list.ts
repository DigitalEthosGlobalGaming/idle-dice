import * as ex from "excalibur";
import { Label } from "@src/ui/elements/label";
import { TestPanelContainer } from "./test-panel-container";
import { ExtendedPointerEvent } from "@src/input/extended-pointer-event";
import { List } from "@src/ui/elements/list";

export class TestListPanel extends TestPanelContainer {

    setup() {
        let list = this.addPanel("list", List);
        list.padding = 5;

        for (let i = 0; i < 10; i++) {
            let label = list.addPanel("label-" + i, Label);
            label.acceptingInputs = true;
            label.text = `Label ${i}`;
            label.fontSize = 20;
            label.onHoverChanged = (_evt: ExtendedPointerEvent) => {
                if (label.isHovered) {
                    label.color = ex.Color.Green;
                } else {
                    label.color = ex.Color.White;
                }
            }
        }

    }

}