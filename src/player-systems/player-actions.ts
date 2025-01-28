import { ImageSource } from "excalibur";
import { Resources } from "@src/player-systems/../resources";
import { Roller } from "@src/buildings/roller";
import { WanderingKnight } from "@src/buildings/wandering-knight";
import { Dice } from "@src/buildings/dice";
import { Bishop } from "@src/buildings/bishop";
export enum PlayerActions {
  NONE = "NONE",
  NEWDICE = "NEW_DICE",
  NEWROLLER = "NEWROLLER",
  NEWKNIGHT = "NEWKNIGHT",
  BISHOP = "BISHOP",
  REMOVE = "REMOVE",
  UPGRADES = "UPGRADES",
}

export enum PlayerActionTypes {
  BUILDABLE = "BUILDABLE",
  MENU = "MENU",
}

export type PlayerAction =
  | {
      name: string;
      code: PlayerActions;
      type: PlayerActionTypes.MENU;
      image: ImageSource;
      tooltip: string;
      unlocked?: boolean;
    }
  | PlayerActionBuildable;

type PlayerActionBuildable = {
  name: string;
  code: PlayerActions;
  type: PlayerActionTypes.BUILDABLE;
  unlocked?: boolean;
  building: {
    cost: () => number;
    classRef: (new () => any) | null;
  };
  image: ImageSource;
  tooltip: string;
};

export const playerActions: PlayerAction[] = [
  {
    code: PlayerActions.NEWDICE,
    image: Resources.DiceOut,
    name: "Buy Dice",
    type: PlayerActionTypes.BUILDABLE,
    building: {
      cost: () => 10,
      classRef: Dice,
    },
    unlocked: true,
    tooltip:
      "10⚡︎ - Will roll to generate income.\n         Click to roll once placed.",
  },
  {
    code: PlayerActions.NEWROLLER,
    image: Resources.ChessPawn,
    name: "Buy Pawn",
    type: PlayerActionTypes.BUILDABLE,
    unlocked: false,
    building: {
      cost: () => 100,
      classRef: Roller,
    },
    tooltip: "100⚡︎ - Every 10 seconds will roll all touching dice.",
  },
  {
    code: PlayerActions.NEWKNIGHT,
    image: Resources.ChessKnight,
    name: "Buy Wandering Knight",
    type: PlayerActionTypes.BUILDABLE,
    building: {
      cost: () => 1000,
      classRef: WanderingKnight,
    },
    tooltip: "1000⚡︎ - Moves around the board, strenghtening dice.",
  },
  {
    code: PlayerActions.BISHOP,
    image: Resources.ChessBishop,
    name: "Buy Bishop",
    type: PlayerActionTypes.BUILDABLE,
    unlocked: false,
    building: {
      cost: () => 10000,
      classRef: Bishop,
    },
    tooltip: "10000⚡︎ - TODO",
  },
  {
    code: PlayerActions.REMOVE,
    image: Resources.DiceSkull,
    name: "Remove",
    unlocked: true,
    building: {
      cost: () => 0,
      classRef: null,
    },
    type: PlayerActionTypes.BUILDABLE,
    tooltip: "Removes a dice from the board.",
  },
  {
    code: PlayerActions.UPGRADES,
    image: Resources.FlaskFull,
    unlocked: true,
    name: "Show Research",
    type: PlayerActionTypes.MENU,
    tooltip: "Show the research panel.",
  },
];
