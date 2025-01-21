
import { Scene } from "excalibur";
import { Dice } from "./buildings/dice";
import { Roller } from "./buildings/roller";
import { GridSpace } from "./grid-system/grid-space";
import { DiceGameGridSystem } from "./grid-system/grid-system-actor";
import { Player } from "./player-systems/player";
import { SaveSystem } from "./systems/save-system";


const classes = [
    Player,
    Dice,
    Roller,
    DiceGameGridSystem,
    GridSpace
];

export class DiceSaveSystem extends SaveSystem {
    constructor() {
        super(classes);
    }

    save(obj: Scene): any {
        const data = super.save(obj);
        localStorage.setItem("save", JSON.stringify(data));
        return data;
    }


    load(scene: Scene): void {
        let data = localStorage.getItem("save");
        if (data == null) {
            return;
        }

        super.load(scene, data ?? '');
    }

}
