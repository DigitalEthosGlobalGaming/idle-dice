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
    name: "Move",
    tooltip: "Move to another location",
  },
  {
    code: PlayerActions.NEWROLLER,
    image: Resources.HandCube,
    name: "Roll",
    tooltip: "Move to another location",
  },
];
