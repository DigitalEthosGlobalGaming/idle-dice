import * as ex from "excalibur";
import { PlayerActionsUi } from "../../player-systems/player-actions-ui";
import { Panel } from "../panel";

export class PlayerUi extends Panel {
  isMoving = false;
  playerActionsUi!: PlayerActionsUi;

  onAdd(): void {
    super.onAdd();
    const bounds = this.scene?.camera?.viewport;
    if (bounds == null) {
      throw new Error("Bounds are null");
    }
    this.pos = ex.vec(-bounds.width / 2, -bounds.height / 2);
  }

  onRender(): void {
    super.onRender();

    this.playerActionsUi = this.addPanel(PlayerActionsUi);
  }

  override calculateBounds(): ex.BoundingBox | null {
    const camera = this.scene?.camera;
    const viewPort = camera?.viewport;
    if (viewPort == null) {
      return null;
    }
    return viewPort.clone();
  }
}
