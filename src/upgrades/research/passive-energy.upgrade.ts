import { GrowthType } from "@src/utility/big-o-calculations";
import { Upgrade } from "@src/components/upgrade-component";

const parts = [
  `Generates {value}⚡︎ every second.`,
  `{nextCost}⚡︎ - Increase to {nextValue}⚡︎`,
];
export class PassiveEnergyComponent extends Upgrade {
  override name = "Passive Energy";
  constructor() {
    super();
    this.level = 1;
    this.maxLevel = 20;
    this.calculate();
  }
  get description(): string {
    return parts.join("\n");
  }
  override _baseCost: number = 100;
  override _baseValue: number = 1;
  override _costType = GrowthType.EXPONENTIAL;
  override _bonusType = GrowthType.QUADRATIC;
}
