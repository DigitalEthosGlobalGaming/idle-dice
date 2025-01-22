import * as ex from "excalibur";
import { InputManager } from "./input/input-manager";
import { Player } from "./player-systems/player";

type DebugDrawElements = {
  bounds: ex.BoundingBox;
  color: ex.Color;
  endTime: number;
};

export class Level extends ex.Scene {
  inputSystem!: InputManager;
  player?: Player;
  debugElements: Record<string, DebugDrawElements> = {};

  drawDebug(
    bounds: ex.BoundingBox,
    id: string | number,
    color?: ex.Color
  ): void {
    id = (id || Date.now()).toString();
    this.debugElements[id] = {
      bounds,
      color: color ?? ex.Color.Red,
      endTime: Date.now() + 1000,
    };
  }

  onPostDraw(ctx: ex.ExcaliburGraphicsContext, elapsed: number): void {
    super.onPostDraw(ctx, elapsed);
    const debugElements = Object.values(this.debugElements);
    if (debugElements.length > 0) {
      let oldZ = ctx.z;
      let center = this.camera.viewport.topLeft;
      ctx.translate(-center.x, -center.y);
      ctx.z = 100000;
      for (const index in debugElements) {
        if (!debugElements.hasOwnProperty(index)) {
          continue;
        }
        const element = debugElements[index];
        if (element.endTime < Date.now()) {
          delete debugElements[index];
          continue;
        }
        const bounds = element.bounds;

        ctx.drawRectangle(
          bounds.topLeft,
          bounds.width,
          bounds.height,
          ex.Color.fromRGB(0, 0, 0, 0),
          element.color,
          2
        );
      }
      ctx.translate(center.x, center.y);
      ctx.z = oldZ;
    }
  }

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
