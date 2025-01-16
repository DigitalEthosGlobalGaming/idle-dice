import * as ex from "excalibur";
import { Level } from "../level";
import { Panel } from "../ui/panel";
import { Label } from "../ui/elements/label";
import { List } from "../ui/elements/list";
import { Button } from "../ui/elements/button";

const elements: any[] = [
  "HELP",
  "-----Objective-----",
  " ",
  "Roll dice and try to get as much energy as possible",
  "-----How to play-----",
  " ",
  "1) Click and drag your mouse to move the camera",
  "2) Choose what to place using the buttons on the bottom of the screen",
  "3) Place a dice, then click on it to roll it, this generates energy",
  "4) Place rollers which will automatically roll dice touching it (not diagonal)",
  " ",
];

class HowToPlayUi extends Panel {
  onRender(): void {
    super.onRender();
    const list = this.addPanel("list", List);
    for (const elementIndex in elements) {
      const label = list.addPanel(elementIndex, Label);
      label.fontSize = 30;
      label.text = elements[elementIndex];
      label.labelAnchor = ex.vec(0.5, 0.5);
    }

    const button = list.addPanel("back", Button);
    button.text = "Back";
    button.fontSize = 20;
    button.onClick = () => {
      this.scene?.engine.goToScene("WelcomeScene");
    };
  }
}

export class HowToPlayScene extends Level {
  mainPanel!: HowToPlayUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    if (this.mainPanel == null) {
      this.mainPanel = new HowToPlayUi();
      this.add(this.mainPanel);
      this.mainPanel.pos = ex.vec(this.camera.viewport.width / 2, 0);
    }
  }
}
