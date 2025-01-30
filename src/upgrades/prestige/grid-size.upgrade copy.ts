import { GrowthType } from "@src/utility/big-o-calculations";
import { Upgrade, UpgradeType } from "@src/components/upgrade-component";

export class GridSizeUpgrade extends Upgrade {
  override name = "Grid Size";
  type: UpgradeType = "PRESTIGE";
  get description(): string {
    const parts = [
      `{nextCost}⏣ - Increases playing space to {${this.nextValue + 16}} x {${
        this.nextValue + 16
      }}`,
    ];

    return parts.join("\n");
  }
  protected override _maxLevel: number = 16;
  override _baseCost: number = 10;
  override _baseValue: number = 1;
  override _costType = GrowthType.LINEAR;
  override _bonusType = GrowthType.LINEAR;

  onBuy(): void {
    super.onBuy();
    this.player.getScene().resizeGrid();
  }
}
