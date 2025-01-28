import { GrowthType } from "@src/components/upgrades/../../utility/big-o-calculations";
import { Upgrade } from "@src/components/upgrades/../upgrade-component";
import {
  PlayerActions,
  playerActions,
} from "@src/player-systems/player-actions";

export class BishopUpgrade extends Upgrade {
  override name = "Bishop";
  get description(): string {
    if (this.level == 0) {
      return [
        `{nextCost}⚡︎ - Allows building of bishop`,
        ` - Rolls all dice in a diagonal.`,
      ].join("\n");
    }

    const parts = [
      ` adds {${
        Math.round(this.value) / 10
      } to a dice's multiplier when moving into a neighboring tile.`,
      `{nextCost} - Increase to {${Math.round(this._nextValue) / 10}}⚡︎`,
    ];

    return parts.join("\n");
  }
  override _baseCost: number = 100000;
  override _baseValue: number = 1;
  override _costType = GrowthType.LOGARITHMIC;
  override _bonusType = GrowthType.LINEAR;

  calculate() {
    super.calculate();
    if (this.level == 0) {
      this._nextCost = 2500;
    }
    if (this.player == null) {
      return;
    }
    if (this.level >= 1) {
      playerActions.find((a) => a.code == PlayerActions.NEWKNIGHT)!.unlocked =
        true;
      if (this.player.playerUi != null) {
        this.player.playerUi.allDirty = true;
      }
    }
  }
}
