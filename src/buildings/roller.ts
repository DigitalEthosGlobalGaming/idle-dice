import { Building } from "../building";
import { Resources } from "../resources";
import { Dice } from "./dice";

export class Roller extends Building {
  tickRate: number = 10000;
  constructor() {
    super();
    this.spriteImage = Resources.ChessQueen;
  }
  onTick(_delta: number): void {
    this.rollDice();
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
