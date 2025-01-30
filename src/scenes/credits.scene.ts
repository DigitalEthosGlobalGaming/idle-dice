import * as ex from "excalibur";
import { Level } from "@src/level";
import { Panel } from "@src/ui/panel";
import { Label } from "@src/ui/elements/label";
import { List } from "@src/ui/elements/list";
import { Button } from "@src/ui/elements/button";

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
    this.size = this.screenSize.scale(0.9);
    this.pos = this.screenSize.scale(0.5);

    const list = this.addPanel("list", List);
    for (const element of creditElements) {
      const label = list.addPanel(element, Label);
      label.fontSize = 30;
      label.text = element;
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
  mainPanel?: CreditUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    if (this.mainPanel == null) {
      this.mainPanel = new CreditUi();
      this.add(this.mainPanel);
    }
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.mainPanel = undefined;
  }
}
