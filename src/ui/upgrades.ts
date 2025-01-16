import * as ex from "excalibur";
import { Button } from "../ui/elements/button";
import { Label } from "../ui/elements/label";
import { List } from "../ui/elements/list";
import { Panel } from "../ui/panel";
import { Modal } from "./modal";

type Upgrade = {
  code: string;
  name: string;
  cost: number;
  description: string;
  onPurchase: () => void;
};

const upgrades: Upgrade[] = [
  {
    code: "UPG1",
    name: "Upgrade 1",
    cost: 100,
    description: "This is the first upgrade",
    onPurchase: () => {
      console.log("Upgrade 1 purchased");
    },
  },
  {
    code: "UPG2",
    name: "Upgrade 2",
    cost: 200,
    description: "This is the second upgrade",
    onPurchase: () => {
      console.log("Upgrade 2 purchased");
    },
  },
  {
    code: "UPG3",
    name: "Upgrade 3",
    cost: 300,
    description: "This is the third upgrade",
    onPurchase: () => {
      console.log("Upgrade 3 purchased");
    },
  },
  {
    code: "UPG4",
    name: "Upgrade 4",
    cost: 400,
    description: "This is the fourth upgrade",
    onPurchase: () => {
      console.log("Upgrade 4 purchased");
    },
  },
  {
    code: "UPG5",
    name: "Upgrade 5",
    cost: 500,
    description: "This is the fifth upgrade",
    onPurchase: () => {
      console.log("Upgrade 5 purchased");
    },
  },
];

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
    buyButton.onClick = () => {
      console.log("Buy button clicked");
    };
    const label = this.addPanel("label", Label);
    let labelPos = buyButton.pos.clone();
    labelPos.setTo(labelPos.x + buyButton.size.x, 0);
    label.fontSize = 20;
    label.labelAnchor = ex.vec(0, 0.5);
    label.pos = labelPos;
    label.text = this.upgrade.name;
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
    const title = this.addPanel("title", Label);
    title.pos = ex.vec(0, 10);
    title.text = "Research (Coming Soon)";
    title.labelAnchor = ex.vec(0.5, 0);
    title.fontSize = 40;

    const list = this.addPanel("list", UpgradesList);
    list.pos = ex.vec(
      -this.getParentBounds().width / 2,
      title.bounds.bottom + 10
    );

    for (const i in upgrades) {
      const upgrade = upgrades[i];
      const upgradePanel = list.addPanel(i, UpgradeListItem);
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
