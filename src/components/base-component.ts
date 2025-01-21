import { Component } from "excalibur";
import { Player } from "@src/player-systems/player";
import { PlayerUi } from "@src/ui/scores/player-ui";

export class BaseComponent extends Component {
    player?: Player;
    getScene() {
        const scene = this.getOwner().scene;
        if (scene == null) {
            throw new Error("Scene is null");
        }
        return scene
    }
    getOwner() {
        if (this.owner == null) {
            throw new Error("Owner is null");
        }
        return this.owner;
    }
    getPlayer(): Player {
        if (this.player != null) {
            return this.player;
        }
        const scene = this.getScene()
        this.player = scene.entities.find((entity) => entity instanceof Player) as Player;
        return this.player;
    }

    getUi(): PlayerUi {
        const player = this.getPlayer();
        return player.playerUi;
    }
}
