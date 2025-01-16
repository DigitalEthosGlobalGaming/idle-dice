import * as ex from "excalibur";
import { Level } from "../level";
import { Panel } from "../ui/panel";
import { Label } from "../ui/elements/label";
import { Button } from "../ui/elements/button";
import { List } from "../ui/elements/list";

class WelcomeUi extends Panel {
  onRender(): void {
    super.onRender();
    const list = this.addPanel("list", List);
    list.spacing = 30;

    const label = list.addPanel("game-title", Label);
    label.fontSize = 60;
    label.text = "RollMaster";
    label.labelAnchor = ex.vec(0.5, 0.5);

    const playButton = list.addPanel("play", Button);
    playButton.text = "Play";
    playButton.fontSize = 20;
    playButton.onClick = () => {
      this.scene?.engine.goToScene("GameScene");
    };

    const helpButton = list.addPanel("help", Button);
    helpButton.text = "Help";
    helpButton.fontSize = 20;
    helpButton.onClick = () => {
      this.scene?.engine.goToScene("HowToPlayScene");
    };

    const creditsButton = list.addPanel("credits", Button);
    creditsButton.text = "Credits";
    creditsButton.fontSize = 20;
    creditsButton.onClick = () => {
      this.scene?.engine.goToScene("CreditScene");
    };
  }
}

export class WelcomeScene extends Level {
  mainPanel!: WelcomeUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    if (this.mainPanel == null) {
      this.mainPanel = new WelcomeUi();
      this.add(this.mainPanel);
      this.mainPanel.pos = ex.vec(this.camera.viewport.width / 2, 0);
    }
  }
}
