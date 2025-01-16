import * as ex from "excalibur";
import { InputManager } from "./input-manager";
import { Player } from "./player-systems/player";

export class Level extends ex.Scene {
  inputSystem!: InputManager;
  player?: Player;

  override onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    this.add(new InputManager());
  }

  override onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.inputSystem?.kill();
    this.remove(this.inputSystem);
  }
}
