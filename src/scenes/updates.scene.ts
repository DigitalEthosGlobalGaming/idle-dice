import * as ex from "excalibur";
import { GameUpdate, gameUpdates } from "../game-updates";
import { Level } from "../level";
import { Label } from "../ui/elements/label";
import { List } from "../ui/elements/list";
import { Panel } from "../ui/panel";
import { Button } from "../ui/elements/button";

class UpdateItem extends List {
  _gameUpdate: GameUpdate | null = null;
  set gameUpdate(value: GameUpdate | null) {
    this._gameUpdate = value;
    this.allDirty = true;
  }

  get gameUpdate(): GameUpdate | null {
    return this._gameUpdate;
  }

  onRender(): void {
    super.onRender();
    if (this.gameUpdate == null) {
      return;
    }
    if (!this.hasPanel("date")) {
      const date = this.addPanel("date", Label);
      date.fontSize = 20;
      date.text = this.gameUpdate.date;
    }

    for (const category in this.gameUpdate.updates) {
      if (this.hasPanel(category)) {
        continue;
      }
      const categoryLabel = this.addPanel(category, Label);
      categoryLabel.pos = ex.vec(20, 0);
      categoryLabel.fontSize = 20;
      categoryLabel.text = category;
      const updates = this.gameUpdate.updates[category];
      for (const update of updates) {
        if (this.hasPanel(update)) {
          continue;
        }
        const updateLabel = this.addPanel(update, Label);
        updateLabel.pos = ex.vec(60, 0);
        updateLabel.fontSize = 20;
        updateLabel.text = update;
      }
    }
  }
}

class UpdatesUi extends Panel {
  onRender(): void {
    super.onRender();
    const list = this.addPanel("list", List);
    list.spacing = 30;
    const updates = gameUpdates;
    for (const element of updates) {
      const label = list.addPanel(`update-${element.id}`, UpdateItem);
      label.gameUpdate = element;
    }

    // if (!list.hasPanel("back")) {
    //   const button = list.addPanel("back", Button);
    //   button.text = "Back";
    //   button.fontSize = 20;
    //   button.onClick = () => {
    //     this.scene?.engine.goToScene("WelcomeScene");
    //   };
    // }
  }
}

export class UpdatesScene extends Level {
  mainPanel?: UpdatesUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    if (this.mainPanel == null) {
      this.mainPanel = new UpdatesUi();
      this.add(this.mainPanel);
      this.mainPanel.pos = ex.vec(this.camera.viewport.width / 2, 0);
    }
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.mainPanel = undefined;
  }
}
