import * as ex from "excalibur";
import { Upgrade } from "../components/upgrade-component";
import { Button } from "../ui/elements/button";
import { Label } from "../ui/elements/label";
import { List } from "../ui/elements/list";
import { Panel } from "../ui/panel";
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
    buyButton.pos.setTo(
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
      }
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
    }
    buyButton.onClick = () => {
      this.upgrade.buy();
      updateTooltip();
      this.dirty = true;
    };

    updateTooltip();

    const label = this.addPanel("label", Label);
    let labelPos = buyButton.pos.clone();
    labelPos.setTo(labelPos.x + buyButton.size.x, 0);
    label.fontSize = 20;
    label.labelAnchor = ex.vec(0, 0.5);
    label.pos = labelPos;
    let text = `LV ${this.upgrade.level} ${this.upgrade.name}`;
    if (this.upgrade.level == 0) {
      text = `Unlock ${this.upgrade.name}`;
    }
    label.text = text;
  }
}

export class UpgradesList extends List {
  onRender(): void {
    super.onRender();
    this.spacing = 0;
  }
}

export class UpgradeUi extends Panel {
  onRender() {
    if (this.player == null) {
      return;
    }
    const title = this.addPanel("title", Label);
    title.pos = ex.vec(0, 10);
    title.text = "Research";
    title.labelAnchor = ex.vec(0.5, 0);
    title.fontSize = 40;

    const list = this.addPanel("list", UpgradesList);
    list.pos = ex.vec(
      -this.getParentBounds().width / 2,
      title.bounds.bottom + 10
    );

    const upgrades = this.player.upgrades;
    // console.log(upgrades);
    for (const i in upgrades) {
      const upgrade = upgrades[i];
      const upgradePanel = list.addPanel(upgrade.code, UpgradeListItem);
      upgradePanel.upgrade = upgrade;
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
