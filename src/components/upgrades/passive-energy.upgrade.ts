import { Player } from "@src/components/upgrades/../../player-systems/player";
import { GrowthType } from "@src/components/upgrades/../../utility/big-o-calculations";
import { Upgrade } from "@src/components/upgrades/../upgrade-component";

const parts = [
    `Generates {value}⚡︎ every second.`,
    `{nextCost}⚡︎ - Increase to {nextValue}⚡︎`
]
export class PassiveEnergyComponent extends Upgrade {
    override name = "Passive Energy";
    constructor(owner: Player) {
        super(owner);
        this.level = 1;
        this.calculate();
    }
    get description(): string {
        return parts.join('\n');
    }
    override _baseCost: number = 100;
    override _baseValue: number = 1;
    override _costType = GrowthType.EXPONENTIAL;
    override _bonusType = GrowthType.QUADRATIC;
}
