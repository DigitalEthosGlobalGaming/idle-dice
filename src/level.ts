import * as ex from "excalibur";
import { DiceGameGridSystem } from "./grid-system/grid-system-actor";
import { InputManager } from "./input-manager";
import { Player } from "./player-systems/player";

export class Level extends ex.Scene {
  score: number = 0;
  best: number = 0;
  random = new ex.Random();
  player!: Player;
  gridSystem: DiceGameGridSystem | null = null;
  gridColor = new ex.Color(255 * 0.25, 255 * 0.25, 255 * 0.25, 1);
  inputSystem!: InputManager;

  override onActivate(): void {
    this.add(new InputManager());
    this.gridSystem = new DiceGameGridSystem(
      new ex.Vector(32, 32),
      new ex.Vector(32, 32)
    );
    this.add(this.gridSystem);

    this.player = new Player();
    this.add(this.player);
  }

  onPreDraw(ctx: ex.ExcaliburGraphicsContext, elapsed: number): void {
    const gridBounds = this.gridSystem?.getBounds();
    if (gridBounds == null) {
      return;
    }
    const position = gridBounds?.topLeft;
    const width = gridBounds?.width;
    const height = gridBounds?.height;

    const cameraTopLeft = this.camera.viewport.topLeft;

    ctx.drawRectangle(
      position.clone().sub(cameraTopLeft),
      width,
      height,
      this.gridColor
    );
    super.onPreDraw(ctx, elapsed);
  }
}
