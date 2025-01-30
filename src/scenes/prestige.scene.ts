import { Level } from "@src/level";
import { Button } from "@src/ui/elements/button";
import { Label } from "@src/ui/elements/label";
import { List } from "@src/ui/elements/list";
import { Panel } from "@src/ui/panel";
import * as ex from "excalibur";

const elements = [
  {
    text: "CONGRATULATIONS",
    size: 40,
  },
  {
    text: "Your efforts as rollmaster has been noticed",
    size: 24,
  },
  {
    text: "Keep playing to unlock upgrades!",
    size: 24,
  },
];

class Ui extends Panel {
  onRender(): void {
    super.onRender();
    this.size = this.screenSize.scale(0.9);
    this.pos = this.screenSize.scale(0.5);

    const list = this.addPanel("list", List);
    list.spacing = 30;

    for (const elementIndex in elements) {
      const label = list.addPanel(elementIndex, Label);
      let element = elements[elementIndex];
      label.fontSize = element.size;
      label.text = element.text;
    }

    const button = list.addPanel("back-button", Button);
    button.text = "Back";
    button.fontSize = 16;
    button.onClick = () => {
      this.scene?.engine.goToScene("GameScene");
    };
  }
}

export class PrestigeScene extends Level {
  mainPanel!: Ui;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    this.mainPanel = new Ui();
    this.add(this.mainPanel);
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.remove(this.mainPanel);
  }
}
