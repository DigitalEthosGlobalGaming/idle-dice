import { ImageSource } from "excalibur";
import { Resources } from "@src/player-systems/../resources";
export enum PlayerActions {
  NONE = "NONE",
  NEWDICE = "NEW_DICE",
  NEWROLLER = "NEWROLLER",
  REMOVE = "REMOVE",
  UPGRADES = "UPGRADES",
}

export enum PlayerActionTypes {
  BUILDABLE = "BUILDABLE",
  MENU = "MENU",
}

export type PlayerAction = {
  name: string;
  code: PlayerActions;
  type: PlayerActionTypes;
  image: ImageSource;
  tooltip: string;
};

export const playerActions: PlayerAction[] = [
  {
    code: PlayerActions.NEWDICE,
    image: Resources.DiceOut,
    name: "Buy Dice",
    type: PlayerActionTypes.BUILDABLE,
    tooltip:
      "10⚡︎ - Will roll to generate income.\n         Click to roll once placed.",
  },
  {
    code: PlayerActions.NEWROLLER,
    image: Resources.HandCube,
    name: "Buy Roller",
    type: PlayerActionTypes.BUILDABLE,
    tooltip: "100⚡︎ - Every 10 seconds will roll all touching dice.",
  },
  {
    code: PlayerActions.REMOVE,
    image: Resources.DiceSkull,
    name: "Remove",
    type: PlayerActionTypes.BUILDABLE,
    tooltip: "Removes a dice from the board.",
  },
  {
    code: PlayerActions.UPGRADES,
    image: Resources.FlaskFull,
    name: "Show Research",
    type: PlayerActionTypes.MENU,
    tooltip: "Show the research panel.",
  },
];
