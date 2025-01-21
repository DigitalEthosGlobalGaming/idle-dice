import * as ex from "excalibur";
import { GameUpdate, gameUpdates } from "@src/scenes/../game-updates";
import { Level } from "@src/scenes/../level";
import { Label } from "@src/scenes/../ui/elements/label";
import { List } from "@src/scenes/../ui/elements/list";
import { Panel } from "@src/scenes/../ui/panel";
import { Button } from "@src/scenes/../ui/elements/button";
import { hashCheck } from "@src/utility/hash";

class UpdateItem extends List {
  _gameUpdate: GameUpdate | null = null;
  set gameUpdate(value: GameUpdate | null) {
    this._gameUpdate = value;
    if (hashCheck(value, this._gameUpdate)) {
      return;
    }
    this.allDirty = true;
  }

  get gameUpdate(): GameUpdate | null {
    return this._gameUpdate;
  }

  childRender() {
    if (this.gameUpdate == null) {
      return;
    }
    const date = this.addPanel("date", Label);
    date.fontSize = 30;
    date.text = this.gameUpdate.date;

    for (const category in this.gameUpdate.updates) {
      const categoryLabel = this.addPanel(category, Label);
      categoryLabel.fontSize = 20;
      categoryLabel.text = category;
      const updates = this.gameUpdate.updates[category];
      for (const update of updates) {
        const updateLabel = this.addPanel(update, Label);
        updateLabel.fontSize = 20;
        updateLabel.text = update;
      }
    }
    this.calculateSize();
    console.log(this.size);
  }

  onRender(): void {
    super.onRender();
    this.childRender();
  }
}

class UpdatesUi extends Panel {
  onRender(): void {
    super.onRender();
    this.size = this.screenSize.scale(0.9);
    this.pos = this.screenSize.scale(0.5);
    const list = this.addPanel("list", List);
    list.spacing = 30;

    const updates = gameUpdates;
    for (const element of updates) {
      const updateItem = list.addPanel(`update-${element.id}`, UpdateItem);
      updateItem.gameUpdate = element;
    }


    const button = list.addPanel("back", Button);
    button.text = "Back";
    button.fontSize = 20;
    button.onClick = () => {
      this.scene?.engine.goToScene("WelcomeScene");
    };
  }
}

export class UpdatesScene extends Level {
  mainPanel?: UpdatesUi;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    if (this.mainPanel == null) {
      this.mainPanel = new UpdatesUi();
      this.add(this.mainPanel);
    }
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.mainPanel = undefined;
  }
}
