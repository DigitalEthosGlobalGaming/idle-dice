import * as ex from "excalibur";
import { Level } from "../level";
import { Panel } from "../ui/panel";
import { Label } from "../ui/elements/label";
import { Button } from "../ui/elements/button";
import { List } from "../ui/elements/list";

export const Scenes: Record<string, string> = {
  Play: "GameScene",
  Updates: "UpdatesScene",
  Help: "HowToPlayScene",
  Credits: "CreditScene",
};
class WelcomeUi extends Panel {
  onRender(): void {
    super.onRender();
    const list = this.addPanel("list", List);
    list.spacing = 30;

    const label = list.addPanel("game-title", Label);
    label.fontSize = 60;
    label.text = "Roll Masters";
    label.labelAnchor = ex.vec(0.5, 0.5);

    for (const title in Scenes) {
      const sceneButton = list.addPanel(title, Button);
      sceneButton.text = title;
      sceneButton.fontSize = 20;
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
    this.mainPanel.pos = ex.vec(this.camera.viewport.width / 2, 0);
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.remove(this.mainPanel);
  }
}
