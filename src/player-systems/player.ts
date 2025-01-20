import * as ex from "excalibur";
import { ExtendedKeyEvent } from "../input/extended-key-event";
import { InputManager } from "../input/input-manager";
import { Serializable } from "../systems/save-system";
import { PlayerBase } from "./player-base";
import { random } from "../utility/random";


export class Player extends PlayerBase implements Serializable {
  serializeId: string = "PLAYER";
  serialize() {
    return {
      position: this.pos,
      energy: this.scoreComponent.score
    }
  }
  deserialize(data: any): void {
    this.wishPosition = new ex.Vector(data.position._x, data.position._y);
    this.scoreComponent.score = data.energy;
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    InputManager.register(this);
  }

  onKeyUp(e: ExtendedKeyEvent) {
    if (e.key == ex.Keys.NumpadAdd) {
      this.getScene().saveSystem.save(this.getScene());
    }
    if (e.key == ex.Keys.NumpadSubtract) {
      this.getScene().saveSystem.load({
        obj: this.getScene(),
        data: ""
      }
      );
    }
    if (e.key == ex.Keys.ArrowUp) {
      const randomX = random.integer(16, 32);
      const randomY = random.integer(16, 32);
      const gridSystem = this.getScene().gridSystem;
      if (gridSystem != null) {
        gridSystem.size = new ex.Vector(randomX, randomY);
      }
    }
  }


}
