import * as ex from "excalibur";
import { Level } from "../level";
import { Panel } from "../ui/panel";
import { Label } from "../ui/elements/label";

class WelcomeUi extends Panel {
    onRender(): void {
        super.onRender();
        const label = this.addPanel("game-title", Label);
        label.fontSize = 40;
        label.text = "RollMaster";
        label.labelAnchor = ex.vec(0.5, 0.5);
        this.pos = this.getParentBounds()?.center ?? ex.vec(0, 0);
    }
}


export class WelcomeScene extends Level {
    
    onActivate(context: ex.SceneActivationContext): void {
        super.onActivate(context);
        let mainPanel = new WelcomeUi();
        this.add(mainPanel);
        mainPanel.pos = ex.vec(0, 0);
    }
}