import { Building } from "@src/building";
import { Resources } from "@src/resources";
import { random } from "@src/utility/random";
import * as ex from "excalibur";
import { Dice } from "./dice";


export class Rook extends Building {
  static serializeName: string = "Rook";
  tickRate: number = random.integer(450, 550);

  constructor() {
    super();
    this.spriteImage = Resources.ChessRook;
  }

  onTick(_delta: number): void {
    super.onTick(_delta);
    this.move();
  }

  getFreeSpace() {
    let direction = random.fromArray([ex.vec(1, 0), ex.vec(-1, 0), ex.vec(0, 1), ex.vec(0, -1)]);
    let size = this.gridSpace.size;
    let pos = this.gridSpace.gridPos?.clone();
    if (pos == null) {
      return null;
    }
    let response: {
      buildings: Building[];
      newPos: ex.Vector;
    } = {
      buildings: [],
      newPos: ex.vec(0, 0),
    }

    let isInBounds = true;
    while (isInBounds) {
      pos.x = pos.x + direction.x;
      pos.y = pos.y + direction.y;
      if (pos.x < 0 || pos.x > size.x || pos.y < 0 || pos.y > size.y) {
        isInBounds = false;
      } else {
        let building = this.getBuilding(pos);
        if (building == null) {
          response.newPos = pos;
          return response;
        } else {
          response.buildings.push(building);
        }
      }
    }
    return null;
  }


  move() {
    let freeSpace = this.getFreeSpace();
    if (freeSpace == null) {
      return;
    }
    const multiplier = (this.player.getUpgrade("Rook")?.value ?? 1);
    this.moveTo(freeSpace.newPos);
    for (let building of freeSpace.buildings) {
      if (building instanceof Dice) {
        building.multiplier = building.multiplier + multiplier;
      }
    }
    this.nextTick = random.integer(900, 1100);
  }
}
