import * as ex from "excalibur";
import { Level } from "@src/scenes/../level";
import { Panel } from "@src/scenes/../ui/panel";
import { Label } from "@src/scenes/../ui/elements/label";
import { Button } from "@src/scenes/../ui/elements/button";
import { List } from "@src/scenes/../ui/elements/list";
import { InputManager } from "@src/input/input-manager";

export const Scenes: Record<string, string> = {
  Play: "GameScene",
  Updates: "UpdatesScene",
  Help: "HowToPlayScene",
  Credits: "CreditScene",
};
class WelcomeUi extends Panel {
  onRender(): void {
    super.onRender();
    this.size = this.screenSize.scale(0.9);
    this.pos = this.screenSize.scale(0.5);

    const list = this.addPanel("list", List);
    list.spacing = 30;

    const label = list.addPanel("game-title", Label);
    label.fontSize = 60;
    label.text = "Roll Masters";

    for (const title in Scenes) {
      const sceneButton = list.addPanel(title, Button);
      sceneButton.text = title;
      sceneButton.fontSize = 30;
      sceneButton.on(InputManager.Events.pointerEnter, () => {
        sceneButton.backgroundColor = ex.Color.ExcaliburBlue;
      });
      sceneButton.on(InputManager.Events.pointerLeave, () => {
        sceneButton.backgroundColor = ex.Color.White;
      });
      sceneButton.onClick = () => {
        this.scene?.engine.goToScene(Scenes[title]);
      };
    }
  }
}

export class WelcomeScene extends Level {
  mainPanel!: WelcomeUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    this.mainPanel = new WelcomeUi();
    this.add(this.mainPanel);
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.remove(this.mainPanel);
  }
}
