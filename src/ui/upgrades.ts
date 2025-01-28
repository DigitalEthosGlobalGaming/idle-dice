import * as ex from "excalibur";
import { Upgrade } from "@src/components/upgrade-component";
import { Button } from "@src/ui/elements/button";
import { Label } from "@src/ui/elements/label";
import { List } from "@src/ui/elements/list";
import { Panel } from "@src/ui/panel";
import { Modal } from "./modal";

class UpgradeListItem extends Panel {
  _upgrade?: Upgrade;
  get upgrade(): Upgrade {
    return this._upgrade!;
  }
  set upgrade(value: Upgrade) {
    if (this._upgrade?.code == value.code) {
      return;
    }

    this._upgrade = value;
    this.dirty = true;
  }
  onRender(): void {
    super.onRender();
    if (this.upgrade == null) {
      return;
    }
    const buyButton = this.addPanel("buy-button", Button);
    buyButton.pos = ex.vec(
      buyButton.size.x / 2 + buyButton.padding + 5,
      buyButton.pos.y
    );
    buyButton.hoverColor = ex.Color.Green;
    buyButton.text = "Buy";
    buyButton.fontSize = 20;
    const updateTooltip = () => {
      const replacements: any = {
        "{nextCost}": this.upgrade.nextCost.toString(),
        "{nextValue}": this.upgrade.nextValue.toString(),
        "{cost}": this.upgrade.cost.toString(),
        "{value}": this.upgrade.value.toString(),
      };
      let description = this.upgrade.description;
      for (const key in replacements) {
        description = description.replaceAll(key, replacements[key]);
      }
      let title = `LV ${this.upgrade.level} ${this.upgrade.name}`;
      if (this.upgrade.level == 0) {
        title = `Unlock ${this.upgrade.name}`;
      }
      buyButton.tooltip = {
        code: `upgrade-${this.upgrade.code}-${this.upgrade.level}`,
        title: title,
        description: description,
      };
    };
    buyButton.onClick = () => {
      this.upgrade.buy();
      updateTooltip();
      this.dirty = true;
    };

    updateTooltip();

    const label = this.addPanel("label", Label);
    label.align = "left";
    label.fontSize = 20;
    let text = `LV ${this.upgrade.level} ${this.upgrade.name}`;
    if (this.upgrade.level == 0) {
      text = `Unlock ${this.upgrade.name}`;
    }

    if (this.upgrade.isMaxLevel) {
      text = `Maxed ${this.upgrade.name}`;
      buyButton.visible = false;

      label.pos = ex.vec(buyButton.left + label.halfWidth, 0);
    } else {
      label.pos = ex.vec(buyButton.right + label.halfWidth + 10, 0);
    }
    label.text = text;
  }
}

export class UpgradeUi extends Panel {
  onRender() {
    if (this.player == null) {
      return;
    }
    const title = this.addPanel("title", Label);
    title.pos = ex.vec(0, title.halfHeight + 10);
    title.text = "Research";
    title.fontSize = 40;

    const upgrades = this.player.upgrades.filter((u) => u.canResearch);
    if (upgrades.length == 0) {
      const info = this.addPanel("info", Label);
      info.fontSize = 24;
      info.pos = ex.vec(0, title.pos.y + title.height + info.halfHeight);
      info.text = "Keep playing to unlock upgrades!";
    } else {
      this.removePanel("info");
      const list = this.addPanel("list", List);
      list.spacing = 20;

      for (const i in upgrades) {
        const upgrade = upgrades[i];
        if (upgrade.canResearch) {
          const upgradePanel = list.addPanel(upgrade.code, UpgradeListItem);
          upgradePanel.upgrade = upgrade;
        } else {
          list.removePanel(upgrade.code);
        }
      }
      list.pos = ex.vec(
        -this.getParentBounds().width / 2,
        title.pos.y + title.height + list.halfHeight
      );
    }
  }
}

export class UpgradesPanel extends Modal {
  onRender(): void {
    super.onRender();
    const upgradeUi = this.addPanel("upgrade-ui", UpgradeUi);
    upgradeUi.pos = ex.vec(0, -this.size.y / 2);
  }
}
