import { Building } from "@src/building";
import { Dice } from "@src/buildings/dice";
import { GridSpace } from "@src/grid-system/grid-space";
import { Resources } from "@src/resources";
import * as ex from "excalibur";
// import { Player } from "@src/player-systems/player";

export class Bishop extends Building {
  static serializeName: string = "Bishop";
  spaces: GridSpace[] = [];
  tickRate: number = 100;
  currentRange: number = 1;
  bounds: ex.Vector = ex.vec(1, 1);

  constructor() {
    super();
    this.spriteImage = Resources.ChessBishop;
  }

  onBuild(): void {}

  onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.bounds = this.level.gridSystem?.size?.clone() ?? ex.vec(0, 0);
  }

  onTick(_delta: number): void {
    super.onTick(_delta);
    let maxSize = Math.max(this.bounds.x, this.bounds.y);
    if (this.currentRange > maxSize) {
      console.log("reset");
      this.currentRange = 1;
    }
    let topLeft = this.getBuilding(
      ex.vec(-this.currentRange, -this.currentRange).add(this.gridPos)
    );
    let topRight = this.getBuilding(
      ex.vec(this.currentRange, -this.currentRange).add(this.gridPos)
    );
    let bottomRight = this.getBuilding(
      ex.vec(this.currentRange, this.currentRange).add(this.gridPos)
    );
    let bottomLeft = this.getBuilding(
      ex.vec(-this.currentRange, this.currentRange).add(this.gridPos)
    );
    if (topLeft instanceof Dice) {
      topLeft.rollDice();
    }
    if (topRight instanceof Dice) {
      topRight.rollDice();
    }
    if (bottomRight instanceof Dice) {
      bottomRight.rollDice();
    }
    if (bottomLeft instanceof Dice) {
      bottomLeft.rollDice();
    }
    this.currentRange++;
  }
}
