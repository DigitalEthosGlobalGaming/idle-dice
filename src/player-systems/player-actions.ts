import { ImageSource } from "excalibur";
import { Resources } from "../resources";
export enum PlayerActions {
  NONE = "NONE",
  NEWDICE = "NEW_DICE",
  ROLLER = "ROLLER",
}

export type PlayerAction = {
  name: string;
  code: PlayerActions;
  image: ImageSource;
  tooltip: string;
};

export const playerActions: PlayerAction[] = [
  {
    code: PlayerActions.NONE,
    image: Resources.DiceEmpty,
    name: "None",
    tooltip: "No action selected",
  },
  {
    code: PlayerActions.NEWDICE,
    image: Resources.DiceEmpty,
    name: "Move",
    tooltip: "Move to another location",
  },
  {
    code: PlayerActions.ROLLER,
    image: Resources.DiceOut,
    name: "Roll",
    tooltip: "Move to another location",
  },
];
