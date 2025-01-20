import { ImageSource } from 'excalibur';
import { Player } from '../player-systems/player';
import { Resources } from '../resources';
import { growthFunctions, GrowthType } from '../utility/big-o-calculations';


export class Upgrade {
    protected _baseCost: number = 0;
    get baseCost() {
        return this._baseCost;
    }
    set baseCost(value: number) {
        if (this._baseCost == value) {
            return;
        }
        this._baseCost = value;
        this.calculate();
    }

    protected _baseValue: number = 0;
    get baseValue() {
        return this._baseValue;
    }
    set baseValue(value: number) {
        if (this.baseValue == value) {
            return;
        }
        this._baseValue = value;
        this.calculate();
    }

    protected _costType: GrowthType = GrowthType.LINEAR;
    get costType() {
        return this._costType;
    }
    set costType(value: GrowthType) {
        if (this._costType == value) {
            return;
        }
        this._costType = value;
        this.calculate();
    }

    protected _bonusType: GrowthType = GrowthType.LINEAR;
    get bonusType() {
        return this._bonusType;
    }
    set bonusType(value: GrowthType) {
        if (this._bonusType == value) {
            return;
        }
        this._bonusType = value;
        this.calculate();
    }


    protected _cost: number = 0;
    get cost() {
        return this._cost;
    }
    set cost(value: number) {
        if (this._cost == value) {
            return;
        }
        this._cost = value;
        this.calculate();

    }

    protected _value: number = 0;
    get value() {
        return this._value;
    }
    protected _level: number = 0;
    get level() {
        return this._level;
    }
    set level(value: number) {
        if (this._level == value) {
            return;
        }
        this._level = value;
        this.calculate();
    }

    protected _nextCost: number = 0;
    get nextCost() {
        if (this.level == 0) {
            return this.baseCost;
        }
        return this._nextCost;
    }
    protected _nextValue: number = 0;
    get nextValue() {
        if (this.level == 0) {
            return this.baseValue;
        }
        return this._nextValue;
    }

    get code() {
        return this.constructor.name;
    }
    name: string = "Upgrade";
    get description(): string {
        return "";
    }
    icon: ImageSource = Resources.Dollar;
    isPurchased: boolean = false;

    player!: Player;

    constructor(player: Player) {
        this.player = player;
        this.calculate();
    }


    buy() {
        const didBuy = this.player.spendEnergy(this.nextCost);
        if (didBuy) {
            this._level++;
            this.calculate();
        }
    }

    calculate() {
        const costFunction = growthFunctions[this._costType];
        const bonusFunction = growthFunctions[this._bonusType];
        const cost = costFunction(this._level, this._baseCost);
        const nextCost = costFunction(this._level + 1, this._baseCost);
        const value = bonusFunction(this._level, this._baseValue);
        const nextValue = bonusFunction(this._level + 1, this._baseValue);
        this._cost = Math.floor(cost);
        this._value = Math.floor(value);
        this._nextCost = Math.floor(nextCost);
        this._nextValue = Math.floor(nextValue);
    }
}