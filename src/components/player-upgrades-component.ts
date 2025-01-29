import * as ex from "excalibur";
import { Player } from "../player-systems/player";
import { Upgrade } from "./upgrade-component";
import { BetterDiceUpgrade } from "../upgrades/research/better-dice.upgrade";
import { PassiveEnergyComponent } from "../upgrades/research/passive-energy.upgrade";
import { WanderingKnightUpgrade } from "@src/upgrades/research/wandering-knight.upgrade";
import { BishopUpgrade } from "@src/upgrades/research/bishop.upgrade";
import { RookUpgrade } from "../upgrades/research/rook.upgrade";
import { GridSizeUpgrade } from "@src/upgrades/prestige/grid-size.upgrade";

export const upgrades = {
  PassiveEnergy: PassiveEnergyComponent,
  BetterDice: BetterDiceUpgrade,
  WanderingKnight: WanderingKnightUpgrade,
  Bishop: BishopUpgrade,
  Rook: RookUpgrade,
  GridSize: GridSizeUpgrade
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
