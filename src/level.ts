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

  drawDebug(bounds: ex.BoundingBox, id: string | number) {
    id = (id || Date.now()).toString();
    this.debugElements[id] = {
      bounds,
      color: ex.Color.Red,
      endTime: Date.now() + 1000,
    };
  }

  onPostDraw(ctx: ex.ExcaliburGraphicsContext, elapsed: number): void {
    super.onPostDraw(ctx, elapsed);
    const debugElements = this.debugElements;
    for (const index in debugElements) {
      if (!debugElements.hasOwnProperty(index)) {
        continue;
      }
      const element = debugElements[index];
      if (element.endTime < Date.now()) {
        delete debugElements[index];
        continue;
      }

      ctx.drawLine(
        element.bounds.topLeft,
        ex.vec(element.bounds.right, element.bounds.top),
        element.color,
        1
      );
      ctx.drawLine(
        ex.vec(element.bounds.right, element.bounds.top),
        element.bounds.bottomRight,
        element.color,
        1
      );
      ctx.drawLine(
        element.bounds.bottomRight,
        ex.vec(element.bounds.left, element.bounds.bottom),
        element.color,
        1
      );
      ctx.drawLine(
        ex.vec(element.bounds.left, element.bounds.bottom),
        element.bounds.topLeft,
        element.color,
        1
      );
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
