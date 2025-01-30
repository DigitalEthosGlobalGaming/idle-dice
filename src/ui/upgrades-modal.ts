import * as ex from "excalibur";
import { Modal } from "./modal";
import { PrestigeUi } from "./prestige";
import { UpgradeUi } from "./upgrades";

export class UpgradesModal extends Modal {
  protected _currentTab: string = "prestige-ui";
  get currentTab(): string {
    return this._currentTab;
  }
  set currentTab(value: string) {
    if (this._currentTab == value) {
      return;
    }

    this._currentTab = value;
    this.dirty = true;
  }
  onRender(): void {
    super.onRender();
    const upgradeUi = this.addPanel("upgrade-ui", UpgradeUi);
    upgradeUi.pos = ex.vec(0, -this.size.y / 2);
    const prestigeUi = this.addPanel("prestige-ui", PrestigeUi);
    prestigeUi.pos = ex.vec(0, -this.size.y / 2);
    let children = this.getChildrenPanels();
    let currentTab = this.currentTab;
    children.forEach((child) => {
      child.visible = child.name == currentTab;
    });
  }
  onVisibleChanged(_visible: boolean): void {
    this.currentTab = "prestige-ui";
  }
}
