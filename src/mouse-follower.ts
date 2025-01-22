import * as ex from "excalibur";
import { Label } from "@src/ui/elements/label";

export class MouseFollower extends Label {
  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    this.fontSize = 50;
    this.text = "Following";
  }

  onPreUpdate(engine: ex.Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed);
    const mousePosition = engine.input.pointers.primary.lastWorldPos;
    const distance = mousePosition.distance(this.pos);
    if (distance > 5) {
      const maxSpeed = 500; // pixels per second
      const direction = mousePosition.sub(this.pos).normalize();
      const speed = maxSpeed * (distance / 100); // Slow down as it gets closer
      this.vel = direction.scale(speed);
    } else {
      this.acc = ex.Vector.Zero;
    }
  }
}
