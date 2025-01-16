import * as ex from "excalibur";
import { InputHandler } from "../input-manager";
import { Panel } from "./panel";

export enum PanelBackgrounds {
  "ButtonSquareFlat" = "ButtonSquareFlat",
}

export class Modal extends Panel implements InputHandler {
  onInitialize(): void {
    this.background = PanelBackgrounds.ButtonSquareFlat;
    this.size = ex.vec(400, 400);
  }
  onRender(): void {
    super.onRender();
  }
}
