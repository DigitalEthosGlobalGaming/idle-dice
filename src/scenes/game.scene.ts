import * as ex from "excalibur";
import { DiceSaveSystem } from "@src/scenes/../dice-save-system";
import { DiceGameGridSystem } from "@src/scenes/../grid-system/grid-system-actor";
import { Level } from "@src/scenes/../level";
import { Player } from "@src/scenes/../player-systems/player";
import { Serializable } from "@src/scenes/../systems/save-system";


export class GameScene extends Level implements Serializable {
  serialize() {
    return null;
    // throw new Error("Method not implemented.");
  }

  score: number = 0;
  best: number = 0;
  random = new ex.Random();
  gridSystem: DiceGameGridSystem | null = null;
  gridColor = new ex.Color(255 * 0, 255 * 0.1, 255 * 0.1, 1);
  saveSystem!: DiceSaveSystem;
  timer: ex.Timer | null = null;

  override onActivate(ctx: ex.SceneActivationContext): void {
    super.onActivate(ctx);
    if (this.saveSystem == null) {
      this.saveSystem = new DiceSaveSystem();
      this.saveSystem.addClassMapping(GameScene);
    }
    this.load();
  }

  save() {
    this.saveSystem?.save(this);
  }
  load() {
    this.preLoad();
    this.saveSystem?.load(this);
    this.postLoad();
  }

  preLoad(): void {
    this?.player?.kill();
    this?.gridSystem?.kill();
    if (this.timer != null) {
      this.timer?.cancel();
      this.removeTimer(this.timer);
    }
  }

  postLoad(): void {
    this.player = this.entities.find((e) => {
      return e instanceof Player;
    });
    let gridSystem = this.entities.find((e) => {
      return e instanceof DiceGameGridSystem;
    });
    if (gridSystem != null) {
      this.gridSystem = gridSystem;
    }
    let timer = new ex.Timer({
      fcn: () => {
        if (this.gridSystem == null) {
          this.gridSystem = new DiceGameGridSystem();
          this.add(this.gridSystem);
        }
        this.gridSystem.size = new ex.Vector(32, 32);
        this.gridSystem.spaceSize = new ex.Vector(32, 32);

        if (this.player == null) {
          this.player = new Player();
          this.player.score = 10;
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

  deserialize(_data: any): void {

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
