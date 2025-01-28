import * as ex from "excalibur";
import { Player } from "../player-systems/player";
import { Upgrade } from "./upgrade-component";
import { BetterDiceUpgrade } from "./upgrades/better-dice.upgrade";
import { PassiveEnergyComponent } from "./upgrades/passive-energy.upgrade";
import { WanderingKnightUpgrade } from "@src/components/upgrades/wandering-knight.upgrade";

export class PlayerUpgradesComponent extends ex.Component {
  upgrades: { [key: string]: Upgrade } = {};
  get player(): Player {
    return this.owner as Player;
  }
  hasAdded: boolean = false;
  onAdd(owner: ex.Entity): void {
    super.onAdd?.(owner);
    this.addUpgrade(PassiveEnergyComponent);
    this.addUpgrade(BetterDiceUpgrade);
    this.addUpgrade(WanderingKnightUpgrade);
  }

  addUpgrade<T extends Upgrade>(t: new () => T): T {
    let upgrade = this.upgrades[t.name];
    if (upgrade == null) {
      upgrade = new t();
      this.upgrades[t.name] = upgrade;
    }

    if (upgrade.player == null) {
      upgrade.player = this.player;
    }

    return upgrade as T;
  }

  getUpgrade<T extends Upgrade>(t: new () => T): T | null {
    let upgrade = this.upgrades[t.name];

    if (upgrade == null) {
      return null;
    }
    if (upgrade.player == null) {
      upgrade.player = this.player;
    }
    return upgrade as T;
  }
}
