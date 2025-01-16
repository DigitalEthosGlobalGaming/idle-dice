import * as ex from "excalibur";
import { DiceGameGridSystem } from "../grid-system/grid-system-actor";
import { Level } from "../level";
import { Player } from "../player-systems/player";

export class GameScene extends Level {
  score: number = 0;
  best: number = 0;
  random = new ex.Random();
  gridSystem: DiceGameGridSystem | null = null;
  gridColor = new ex.Color(255 * 0, 255 * 0.1, 255 * 0.1, 1);

  override onActivate(ctx: ex.SceneActivationContext): void {
    super.onActivate(ctx);
    let timer = new ex.Timer({
      fcn: () => {
        if (this.gridSystem == null) {
          this.gridSystem = new DiceGameGridSystem(
            new ex.Vector(32, 32),
            new ex.Vector(32, 32)
          );
          this.add(this.gridSystem);
        }
        if (this.player == null) {
          this.player = new Player();
          this.add(this.player);
          const gridSize = this.gridSystem.getBounds().center;
          this.player.wishPosition = gridSize.clone();
        }
      },
      interval: 250,
    });
    timer = this.addTimer(timer);
    timer.start();
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
