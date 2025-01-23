import * as ex from "excalibur";
import { Building } from "@src/building";
import { Resources } from "@src/resources";
import { Dice } from "./dice";
import { Engine, Timer } from "excalibur";
import { Player } from "@src/player-systems/player";

const rollers: Record<number, Roller> = {};
export class Roller extends Building {
  static globalTimer: Timer | null = null;
  static rollRollers() {
    let player: Player | null = null;
    for (let id in rollers) {
      let roller = rollers[id];
      player = roller.player;
      roller.rollDice();
    }
    if (player) {
      // this.globalTimer?.interval = player.getUpgrade()
    }
  }
  constructor() {
    super();
    this.spriteImage = Resources.ChessQueen;
  }
  onAdd(engine: Engine): void {
    if (Roller.globalTimer == null) {
      Roller.globalTimer = new ex.Timer({
        fcn: () => {
          Roller.rollRollers();
        },
        interval: 10000,
        repeats: true,
      });
      this.scene?.addTimer(Roller.globalTimer);
      Roller.globalTimer.start();
    }

    rollers[this.id] = this;

    super.onAdd(engine);
  }
  onRemove(engine: Engine): void {
    super.onRemove(engine);
    delete rollers[this.id];
  }

  onTrigger(): void {
    super.onBuild();
    this.rollDice();
  }
  rollDice() {
    let neighbours = this.getNeighbors();
    for (let index in neighbours) {
      let neighbour = neighbours[index as keyof typeof neighbours];
      let children = neighbour?.children ?? [];
      for (let child of children) {
        if (child instanceof Dice) {
          child.rollDice();
        }
      }
    }
  }
}
