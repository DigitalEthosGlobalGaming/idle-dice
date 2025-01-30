import { GameUpdate, gameUpdates } from "@src/game-updates";
import { Level } from "@src/level";
import { Button } from "@src/ui/elements/button";
import { Label } from "@src/ui/elements/label";
import { List } from "@src/ui/elements/list";
import { Panel } from "@src/ui/panel";
import { hashCheck } from "@src/utility/hash";
import * as ex from "excalibur";

class UpdateItem extends List {
  onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
  }
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
    date.color = this.color;

    for (const category in this.gameUpdate.updates) {
      const categoryLabel = this.addPanel(category, Label);
      categoryLabel.color = this.color;
      categoryLabel.fontSize = 20;
      categoryLabel.text = category;
      const updates = this.gameUpdate.updates[category];
      for (const update of updates) {
        const updateLabel = this.addPanel(update, Label);
        updateLabel.color = this.color;
        updateLabel.fontSize = 20;
        updateLabel.text = update;
        updateLabel.pos.x = updateLabel.halfWidth;
      }
    }
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
    list.color = ex.Color.fromRGB(0, 0, 0, 0);
    list.spacing = 30;

    const updates = gameUpdates;
    for (const element of updates) {
      const updateItem = list.addPanel(`update-${element.id}`, UpdateItem);
      updateItem.gameUpdate = element;
      updateItem.left = -this.size.x / 2;
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
