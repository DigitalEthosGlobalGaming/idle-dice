import { ImageSource } from "excalibur";
import { Resources } from "../resources";
export enum PlayerActions {
  NONE = "NONE",
  NEWDICE = "NEW_DICE",
  NEWROLLER = "NEWROLLER",
  REMOVE = "REMOVE",
}

export type PlayerAction = {
  name: string;
  code: PlayerActions;
  image: ImageSource;
  tooltip: string;
};

export const playerActions: PlayerAction[] = [
  {
    code: PlayerActions.NEWDICE,
    image: Resources.DiceOut,
    name: "Buy Dice",
    tooltip: "10⚡︎ - Will roll to generate income.\n         Click to roll once placed."
  },
  {
    code: PlayerActions.NEWROLLER,
    image: Resources.HandCube,
    name: "Buy Roller",
    tooltip: "100⚡︎ - Every 10 seconds will roll all touching dice.",
  },{
    code: PlayerActions.REMOVE,
    image: Resources.DiceSkull,
    name: "Remove",
    tooltip: "Removes a dice from the board.",
  },
];
