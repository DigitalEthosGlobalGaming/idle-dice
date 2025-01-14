import * as ex from "excalibur";
import { PlayerActionsUi } from "../../player-systems/player-actions-ui";
import { Panel } from "../panel";

export class PlayerUi extends Panel {
  isMoving = false;
  playerActionsUi?: PlayerActionsUi;
  acceptingInputs = false;

  onRender(): void {
    const bounds = this.scene?.camera?.viewport;
    if (bounds == null) {
      throw new Error("Bounds are null");
    }
    this.pos = ex.vec(-bounds.width / 2, -bounds.height / 2);
    this.size = ex.vec(bounds.width, bounds.height);
    this.z = 1000;

    super.onRender();
    if (this.playerActionsUi == null) {
      this.playerActionsUi = this.addPanel(
        "player-actions-ui",
        PlayerActionsUi
      );
    }
  }
}
