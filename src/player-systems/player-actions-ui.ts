import * as ex from "excalibur";
import { Button } from "../ui/elements/button";
import { Panel } from "../ui/panel";
import { PlayerAction, PlayerActions, playerActions } from "./player-actions";

export class PlayerActionButton extends Button {
  action: PlayerAction;
  isFocused: boolean = false;
  constructor(parent: Panel, actionCode: PlayerActions) {
    const action = playerActions.find((a) => a.code == actionCode);
    if (action == null) {
      throw new Error(`Action not found: ${actionCode}`);
    }
    super(parent, {
      icon: {
        imageSource: action.image,
        width: 32,
        height: 32,
      },
    });
    this.z = 100;
    this.action = action;
  }
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
    this.isFocused = value;
    this.updateColor();
  }
}

export class PlayerActionsUi extends Panel {
  playerActions: PlayerAction[] = [];
  buttons: PlayerActionButton[] = [];
  currentAction: PlayerAction | null = null;
  hoveredAction: PlayerAction | null = null;

  changeAction(action: PlayerAction) {
    if (this.currentAction != null) {
      const currentActionButton = this.buttons.find(
        (b) => b.action == this.currentAction
      );
      if (currentActionButton != null) {
        currentActionButton.setFocused(false);
      }
    }

    const actionButton = this.buttons.find((b) => b.action == action);
    if (actionButton != null) {
      actionButton.setFocused(true);
    }

    this.currentAction = action;
  }

  onRender(): void {
    const bounds = this.getParentBounds();
    const width = bounds?.width ?? 0;
    const height = bounds?.height ?? 0;
    const buttonWidth = 32;
    const spacing = 10;
    const totalWidth =
      this.playerActions.length * (buttonWidth + spacing) - spacing;
    const startX = (width - totalWidth) / 2;

    for (let i = 0; i < this.playerActions.length; i++) {
      const action = this.playerActions[i];
      const button = new PlayerActionButton(this, action.code);
      button.pos = new ex.Vector(
        startX + i * (buttonWidth + spacing),
        height - buttonWidth - 2
      );
      this.buttons.push(button);
    }
  }
}
