import * as ex from "excalibur";
import { Player } from "../player-systems/player";
import { Upgrade } from "./upgrade-component";
import { BetterDiceUpgrade } from "./upgrades/better-dice.upgrade";
import { PassiveEnergyComponent } from "./upgrades/passive-energy.upgrade";
import { WanderingKnightUpgrade } from "@src/components/upgrades/wandering-knight.upgrade";
import { BishopUpgrade } from "@src/components/upgrades/bishop.upgrade";

export const upgrades = {
  PassiveEnergy: PassiveEnergyComponent,
  BetterDice: BetterDiceUpgrade,
  WanderingKnight: WanderingKnightUpgrade,
  Bishop: BishopUpgrade,
};

export class PlayerUpgradesComponent extends ex.Component {
  upgrades: { [key: string]: Upgrade } = {};
  get player(): Player {
    return this.owner as Player;
  }
  hasAdded: boolean = false;
  onAdd(owner: ex.Entity): void {
    super.onAdd?.(owner);
    for (const key in upgrades) {
      this.addUpgrade(key as keyof typeof upgrades);
    }
  }

  addUpgrade<T extends Upgrade>(t: keyof typeof upgrades): T {
    let upgrade = this.upgrades[t];
    if (upgrade == null) {
      upgrade = new upgrades[t]();
      this.upgrades[t] = upgrade;
    }

    if (upgrade.player == null) {
      upgrade.player = this.player;
    }

    return upgrade as T;
  }

  getUpgrade<T extends Upgrade>(t: keyof typeof upgrades): T | null {
    let upgrade = this.upgrades[t];
    if (upgrade == null) {
      return null;
    }
    if (upgrade.player == null) {
      upgrade.player = this.player;
    }
    return upgrade as T;
  }
}
