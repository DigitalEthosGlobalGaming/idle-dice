import { ImageSource } from "excalibur";
import { Resources } from "../resources";

export type PlayerAction = {
    name: string;
    code: string;
    image: ImageSource;
    tooltip: string;
}


export const playerActions: PlayerAction[] = [
    {
        "code": "NEW_DICE",
        "image": Resources.DiceEmpty,
        "name": "Move",
        "tooltip": "Move to another location"
    },
    {
        "code": "ROLLER",
        "image": Resources.DiceOut,
        "name": "Roll",
        "tooltip": "Move to another location"
    }
]