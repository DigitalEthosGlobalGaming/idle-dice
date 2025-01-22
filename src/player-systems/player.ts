import * as ex from "excalibur";
import { InputManager } from "@src/player-systems/../input/input-manager";
import {
  SerialisedObject,
  Serializable,
} from "@src/player-systems/../systems/save-system";
import { PlayerBase } from "./player-base";

export class Player extends PlayerBase implements Serializable {
  static serializeName: string = "Player";
  serializeId: string = "PLAYER";
  serialize() {
    const upgradeData = this.upgrades
      .map((u) => {
        return {
          code: u.code,
          level: u.level,
        };
      })
      .filter((u) => u.level > 0);
    return {
      position: this.pos,
      energy: this.scoreComponent.score,
      upgrades: upgradeData,
    };
  }
  deserialize(data: any): void {
    this.wishPosition = new ex.Vector(data.position._x, data.position._y);
    this.score = data.energy;
  }

  postDeserialize(data: SerialisedObject): void {
    let savedUpgradeData = data?.data?.upgrades ?? [];
    for (const playerUpgrade of this.upgrades) {
      for (const savedUpgrade of savedUpgradeData) {
        if (playerUpgrade.code == savedUpgrade.code) {
          playerUpgrade.level = savedUpgrade.level;
        }
      }
    }
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    InputManager.register(this);
  }
}
