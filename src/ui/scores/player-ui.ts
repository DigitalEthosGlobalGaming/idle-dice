import * as ex from "excalibur";
import { PlayerActionsUi } from "../../player-systems/player-actions-ui";
import { Panel } from "../panel";
import { PlayerTooltip, Tooltip } from "../../player-systems/player-tooltip";

export class PlayerUi extends Panel {
  isMoving = false;
  playerActionsUi?: PlayerActionsUi;
  private _tooltipElement?: PlayerTooltip;

  private _tooltip: Tooltip | null = null;
  get tooltip(): Tooltip | null {
    return this._tooltip;
  }
  set tooltip(value: Tooltip | null) {
    this._tooltip = value;
    this.dirty = true;
  }

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
    if (this._tooltipElement == null) {
      this._tooltipElement = this.addPanel("player-tooltip", PlayerTooltip);
    }
    this._tooltipElement.tooltip = this.tooltip;
    this._tooltipElement.labelAnchor = ex.vec(1, 0);
    this._tooltipElement.fontSize = 20;
    this._tooltipElement.pos = ex.vec(bounds.width - 10, 10);
  }
}
