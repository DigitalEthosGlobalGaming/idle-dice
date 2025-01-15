import { ImageSource } from "excalibur";
import { Resources } from "../resources";
export enum PlayerActions {
  NONE = "NONE",
  NEWDICE = "NEW_DICE",
  NEWROLLER = "NEWROLLER",
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
    tooltip: "$10 - Will roll to generate income.",
  },
  {
    code: PlayerActions.NEWROLLER,
    image: Resources.HandCube,
    name: "Buy Roller",
    tooltip: "$100 - Every 10 seconds will roll all touching dice.",
  },
];
