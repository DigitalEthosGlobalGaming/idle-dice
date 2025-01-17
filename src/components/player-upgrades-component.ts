import * as ex from 'excalibur';
import { Player } from '../player-systems/player';
import { Upgrade } from './upgrade-component';
import { BetterDiceUpgrade } from './upgrades/better-dice.upgrade';
import { PassiveEnergyComponent } from './upgrades/passive-energy.upgrade';




export class PlayerUpgradesComponent extends ex.Component {
    upgrades: { [key: string]: Upgrade } = {};
    get player(): Player {
        return this.owner as Player;
    }
    hasAdded: boolean = false;
    onAdd(owner: ex.Entity): void {
        super.onAdd?.(owner);
        this.addUpgrade(PassiveEnergyComponent);
        this.addUpgrade(BetterDiceUpgrade)
    }

    addUpgrade<T extends Upgrade>(t: new (owner: Player) => T): T {
        if (this.upgrades[t.name] != null) {
            return this.upgrades[t.name] as T;
        }
        this.upgrades[t.name] = new t(this.owner as Player);
        return this.upgrades[t.name] as T;
    }

    getUpgrade<T extends Upgrade>(t: new () => T): T | null {
        if (this.upgrades[t.name] != null) {
            return this.upgrades[t.name] as T;
        }
        return null;
    }
}