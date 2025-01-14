import * as ex from "excalibur";
import { Button } from "../ui/elements/button";
import { Panel } from "../ui/panel";
import { PlayerAction, playerActions } from "./player-actions";
import { Player } from "./player";
import { Level } from "../level";

export class PlayerActionButton extends Button {
  _action: PlayerAction | null = null;
  set action(value: PlayerAction) {
    this._action = value;
    this.icon = {
      imageSource: value.image,
      width: 64,
      height: 64,
    };
  }
  get action(): PlayerAction {
    if (this._action == null) {
      throw new Error("Action is null");
    }
    return this._action;
  }
  isFocused: boolean = false;

  getParent<T = PlayerActionsUi>(): T {
    if (this.parent instanceof PlayerActionsUi) {
      return this.parent as T;
    }
    throw new Error("Parent is not a PlayerActionsUi");
  }

  override onHoverChanged(): void {
    if (this.isHovered) {
      this.getParent().hoveredAction = this.action;
    }

    this.updateColor();
  }

  onPointerUp(_e: ex.PointerEvent): void {
    this.getParent().changeAction(this.action);
  }

  updateColor() {
    const defaultColor = ex.Color.White;
    const focusedColor = new ex.Color(0, 180, 0, 1);
    let colors = {
      hovered: defaultColor.clone().darken(0.5),
      focused: focusedColor,
      focusedHovered: focusedColor.clone().darken(0.5),
      normal: ex.Color.White,
    };
    if (this.isFocused) {
      if (this.isHovered) {
        this.color = colors.focusedHovered;
      } else {
        this.color = colors.focused;
      }
    } else if (this.isHovered) {
      this.color = colors.hovered;
    } else {
      this.color = colors.normal;
    }
  }

  setFocused(value: boolean) {
    if (value != this.isFocused) {
      this.isFocused = value;
      this.updateColor();
    }
  }

  override collides(vec: ex.Vector): boolean {
    if (this.acceptingInputs === false) {
      return false;
    }

    const bounds = this.globalBounds;
    if (bounds == null) {
      return false;
    }
    return bounds.contains(vec);
  }
}

export class PlayerActionsUi extends Panel {
  get level(): Level {
    if (this.scene instanceof Level) {
      return this.scene;
    }
    throw new Error("Scene is not a Level");
  }
  get player(): Player {
    return this.level.player;
  }
  playerActions: PlayerAction[] = playerActions;
  buttons: PlayerActionButton[] = [];
  currentAction: PlayerAction | null = null;
  hoveredAction: PlayerAction | null = null;
  acceptingInputs = false;

  changeAction(action: PlayerAction) {
    for (let button of this.buttons) {
      if (button.action?.code == action.code) {
        button.setFocused(true);
      } else {
        button.setFocused(false);
      }
    }

    this.currentAction = action;
    this.player.currentAction = action.code;
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    this.changeAction(playerActions[0]);
  }

  onRender(): void {
    const bounds = this.getParentBounds();
    const width = bounds?.width ?? 0;
    const height = bounds?.height ?? 0;
    const buttonWidth = 64;
    const spacing = 32;
    const totalWidth =
      this.playerActions.length * (buttonWidth + spacing) - spacing;
    const startX = (width - totalWidth) / 2;

    for (let i = 0; i < this.playerActions.length; i++) {
      const action = this.playerActions[i];
      const button = this.addPanel(PlayerActionButton);
      button.action = action;
      const x = startX + i * (buttonWidth + spacing);
      button.pos = new ex.Vector(x, height - buttonWidth - 10);
      this.buttons.push(button);
    }
  }
}
