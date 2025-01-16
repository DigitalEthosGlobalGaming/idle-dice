import * as ex from "excalibur";
import { Level } from "../level";
import { Panel } from "../ui/panel";
import { Label } from "../ui/elements/label";
import { List } from "../ui/elements/list";
import { Button } from "../ui/elements/button";

const creditElements: any[] = [
  "Trent Jones - Developer",
  "--------------------------------",
  "Game Engine - Excalibur",
  "     https://excaliburjs.com/",
  "",
  "Assets - Kenney.nl",
  "     https://kenney.nl/",
  " ",
];

class CreditUi extends Panel {
  onRender(): void {
    super.onRender();
    const list = this.addPanel("list", List);
    for (const element of creditElements) {
      const label = list.addPanel(element, Label);
      label.fontSize = 30;
      label.text = element;
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

export class CreditScene extends Level {
  mainPanel!: CreditUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    if (this.mainPanel == null) {
      this.mainPanel = new CreditUi();
      this.add(this.mainPanel);
      this.mainPanel.pos = ex.vec(this.camera.viewport.width / 2, 0);
    }
  }
}
