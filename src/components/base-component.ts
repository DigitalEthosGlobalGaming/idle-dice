import { Player } from "@src/player-systems/player";
import { Component } from "excalibur";

export class BaseComponent extends Component {
  _player?: Player;
  get player() {
    if (this._player != null) {
      return this._player;
    }
    const scene = this.scene;
    this._player = scene.entities.find(
      (entity) => entity instanceof Player
    ) as Player;
    return this._player;
  }
  set player(value: Player) {
    this._player = value;
  }

  get playerUi() {
    return this.player.playerUi;
  }

  get scene() {
    let scene = this.owner?.scene;
    if (scene == null) {
      throw new Error("Scene is null");
    }
    return scene;
  }

  getOwner() {
    if (this.owner == null) {
      throw new Error("Owner is null");
    }
    return this.owner;
  }
}
