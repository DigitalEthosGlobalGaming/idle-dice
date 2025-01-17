import { GrowthType } from "../../utility/big-o-calculations";
import { Upgrade } from "../upgrade-component";


export class BetterDiceUpgrade extends Upgrade {
    override name = "Dice Boosters";
    get description(): string {

        if (this.level == 0) {
            return `{nextCost}⚡︎ - Dice generates {nextValue}⚡︎ extra when rolled.`;
        }

        const parts = [
            `Dice generate {value}⚡︎ extra when rolled.`,
            `{nextCost}⚡︎ - Increase to {nextValue}⚡︎`
        ];


        return parts.join('\n');
    }
    override _baseCost: number = 100;
    override _baseValue: number = 1;
    override _costType = GrowthType.QUADRATIC;
    override _bonusType = GrowthType.LINEAR;
}