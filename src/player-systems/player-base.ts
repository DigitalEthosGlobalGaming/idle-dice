import { Building } from "@src/player-systems/../building";
import { Dice } from "@src/player-systems/../buildings/dice";
import { PlayerUpgradesComponent } from "@src/player-systems/../components/player-upgrades-component";
import { ScoreComponent } from "@src/player-systems/../components/score-component";
import { Upgrade } from "@src/player-systems/../components/upgrade-component";
import { PassiveEnergyComponent } from "@src/player-systems/../components/upgrades/passive-energy.upgrade";
import { Ghost } from "@src/player-systems/../ghost";
import { GridSpace } from "@src/player-systems/../grid-system/grid-space";
import { ExtendedPointerEvent } from "@src/player-systems/../input/extended-pointer-event";
import {
  ButtonStates,
  InputHandler,
} from "@src/player-systems/../input/input-manager";
import { GameScene } from "@src/player-systems/../scenes/game.scene";
import { PlayerUi } from "@src/player-systems/../ui/scores/player-ui";
import * as ex from "excalibur";
import {
  playerActions,
  PlayerActions,
  PlayerActionTypes,
} from "./player-actions";
import { Tooltip } from "./player-tooltip";
import { Environment } from "@src/env";

type MouseState = {
  button: number;
  pos: ex.Vector;
  isDown: boolean;
  downPos: ex.Vector;
  downDelta: ex.Vector;
  pointer: ex.PointerAbstraction;
  dragging: boolean;
  downStartTick: number;
  downDuration: number;
};

type CameraMovementData = {
  isMoving: boolean;
  pos: ex.Vector;
  lastPos: ex.Vector;
};

const costs: { [key in PlayerActions]: number } = {
  NONE: 0,
  NEW_DICE: 10,
  NEWROLLER: 100,
  NEWKNIGHT: 1000,
  REMOVE: 0,
  UPGRADES: 0,
};

export class PlayerBase extends ex.Actor implements InputHandler {
  collides(_vec: ex.Vector): boolean {
    return false;
  }
  acceptingInputs?: boolean | ButtonStates[] | undefined;
  scoreComponent!: ScoreComponent;
  playerUpgradesComponent!: PlayerUpgradesComponent;
  cameraPos = ex.vec(0, 0);
  pointerStates: { [key: number]: MouseState } = [];
  ghost!: Ghost;
  draggingBuilding: Building | null = null;
  playerUi!: PlayerUi;

  _highlightedSpace: GridSpace | null = null;
  get highlightedSpace(): GridSpace | null {
    return this._highlightedSpace;
  }
  set highlightedSpace(space: GridSpace | null) {
    let oldSpace = this._highlightedSpace;
    if (space?.name == this._highlightedSpace?.name) {
      return;
    }
    this.onHighlightSpaceChange(oldSpace, space);
  }

  cameraMovementData: CameraMovementData | null = null;
  wishPosition = ex.vec(0, 0);
  isSetup = false;

  _currentAction: PlayerActions = PlayerActions.NONE;
  get currentAction() {
    return this._currentAction;
  }
  set currentAction(value: PlayerActions) {
    if (value == this._currentAction) {
      return;
    }
    this._currentAction = value;
    this.clearTooltips();
    this.playerUi.dirty = true;
    let relatedAction = playerActions.find((a) => a.code == value);
    if (relatedAction != null) {
      this.showTooltip({
        code: relatedAction.code,
        title: relatedAction.name,
        description: relatedAction.tooltip,
      });
    }
    this.getScene().save();
  }

  _score: number = 0;

  get score() {
    return this?.scoreComponent?.score ?? this._score;
  }
  set score(value: number) {
    if (this.scoreComponent == null) {
      this._score = value;
      return;
    }
    this.scoreComponent.score = value;
  }

  getCamera(): ex.Camera {
    if (this.scene == null) {
      throw new Error("Scene is null");
    }
    return this.scene?.camera;
  }

  getScene(): GameScene {
    if (this.scene == null) {
      throw new Error("Scene is null");
    }
    if (!(this.scene instanceof GameScene)) {
      throw new Error("Scene is not a GameScene");
    }
    return this.scene;
  }

  setup() {
    if (this.scene == null) {
      return;
    }
    if (this.isSetup) {
      return;
    }

    this.isSetup = true;
    if (this.ghost == null) {
      this.ghost = new Ghost();
      this.addChild(this.ghost);
    }

    if (this.playerUi == null) {
      this.playerUi = new PlayerUi();
      this.addChild(this.playerUi);
    }
    if (this.scoreComponent == null) {
      this.scoreComponent = new ScoreComponent();
      this.addComponent(this.scoreComponent);
      this.scoreComponent.score = this.score;
    }
    if (this.playerUpgradesComponent == null) {
      this.playerUpgradesComponent = new PlayerUpgradesComponent();
      this.addComponent(this.playerUpgradesComponent);
    }

    this.scene?.on("im-pointer-down", (e) => {
      this.onPointerDown(e as ExtendedPointerEvent);
    });
    this.scene?.on("im-pointer-move", (e) => {
      this.onPointerMove(e as ExtendedPointerEvent);
    });
    this.scene?.on("im-pointer-up", (e) => {
      this.onPointerUp(e as ExtendedPointerEvent);
    });
    const timer = this.scene?.addTimer(
      new ex.Timer({
        fcn: () => {
          const upgrade = this.getUpgrade(PassiveEnergyComponent);
          let upgradeAmount = upgrade?.value ?? 1;
          this.scoreComponent.updateScore(upgradeAmount);
        },
        interval: 1000,
        repeats: true,
      })
    );
    timer?.start();
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    this.setup();
  }

  onPointerMove(e: ExtendedPointerEvent) {
    const isPrimary = e.isDown("MouseLeft") || e.pointerType == "Touch";
    if (isPrimary) {
      if (this.cameraMovementData == null) {
        this.cameraMovementData = {
          isMoving: true,
          pos: e.screenPos.clone(),
          lastPos: e.screenPos.clone(),
        };
      } else {
        this.cameraMovementData.pos = e.screenPos.clone();

        let diff = this.cameraMovementData.pos.sub(
          this.cameraMovementData.lastPos
        );
        this.wishPosition = this.wishPosition.sub(diff);

        this.cameraMovementData.lastPos = e.screenPos.clone();
      }
    } else {
      this.cameraMovementData = null;
    }
  }

  onPointerDown(_e: ExtendedPointerEvent) { }

  onPointerUp(_e: ExtendedPointerEvent) {
    this.cameraMovementData = null;
  }

  onSpaceClicked(space: GridSpace) {
    if (this.cameraMovementData == null) {
      let currentAction = playerActions.find(
        (a) => a.code == this.currentAction
      );
      if (currentAction?.type == PlayerActionTypes.BUILDABLE) {
        if (this.currentAction == PlayerActions.REMOVE) {
          this.removeBuildable(space.globalPos);
        } else {
          this.placeBuildable(space.globalPos);
        }
      }
      this.getScene().save();
    }
  }

  getEngine(): ex.Engine {
    return this.getScene().engine;
  }

  getGridSystem() {
    const scene = this.getScene();
    return scene.gridSystem;
  }

  onPreUpdate(engine: ex.Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed);
    const camera = this.getCamera();

    let targetPlayerPos = this.wishPosition;
    const bounds = this.getScene().gridSystem?.getBounds();
    if (bounds == null) {
      return;
    }

    if (targetPlayerPos.x < bounds.left) {
      targetPlayerPos.x = bounds.left;
    }
    if (targetPlayerPos.y < bounds.top) {
      targetPlayerPos.y = bounds.top;
    }
    if (targetPlayerPos.x > bounds.right) {
      targetPlayerPos.x = bounds.right;
    }
    if (targetPlayerPos.y > bounds.bottom) {
      targetPlayerPos.y = bounds.bottom;
    }

    this.pos = targetPlayerPos;
    camera.pos = targetPlayerPos;
  }

  removeBuildable(worldPosition: ex.Vector) {
    const space =
      this.getScene().gridSystem?.getSpaceFromWorldPosition(worldPosition);
    if (space == null) {
      return;
    }
    let existingBuilding = space.children.find((c) => c instanceof Building);
    if (existingBuilding != null) {
      existingBuilding.kill();
    }
  }
  placeBuildable(worldPosition: ex.Vector) {
    const space =
      this.getScene().gridSystem?.getSpaceFromWorldPosition(worldPosition);
    if (space == null) {
      return;
    }
    let existingBuilding = space.children.find((c) => c instanceof Building);
    if (existingBuilding == null) {
      const action = playerActions.find((a) => a.code == this.currentAction);
      let cost = costs[this.currentAction];
      if (action?.type == PlayerActionTypes.BUILDABLE) {
        cost = action.building.cost();

        if (this.spendEnergy(cost)) {
          if (this.currentAction == PlayerActions.NEWDICE) {
            let newDice = new Dice();
            newDice.faces = 6;
            newDice.rollSpeed = 1;
            space.addChild(newDice);
            newDice.onBuild();
          } else {
            if (action.building.classRef == null) {
              this.removeBuildable(space.globalPos);
            } else {
              const building = new action.building.classRef();
              space.addChild(building);
              building.onBuild();
            }
          }
        }
      }
    } else {
      existingBuilding.trigger();
    }
  }

  tooltips: Tooltip[] = [];

  updateTooltip() {
    let ui = this.playerUi;
    let tooltip = this.tooltips?.[0] ?? null;
    if (tooltip != null) {
      ui.tooltip = tooltip;
      return;
    }

    let relatedAction = playerActions.find((a) => a.code == this.currentAction);
    if (relatedAction != null) {
      ui.tooltip = {
        code: relatedAction.code,
        title: relatedAction.name,
        description: relatedAction.tooltip,
      };
    }
  }

  clearTooltips() {
    this.tooltips = [];
    this.updateTooltip();
  }

  showTooltip(value: Tooltip) {
    if (this.tooltips.find((t) => t.code == value.code) != null) {
      return;
    }
    this.tooltips.unshift(value);
    this.updateTooltip();
  }

  hideTooltip(value: Tooltip | string) {
    let code = value;
    if (typeof value != "string") {
      code = value.code;
    }
    this.tooltips = this.tooltips.filter((t) => t.code != code);
    this.updateTooltip();
  }
  get upgrades(): Upgrade[] {
    return Object.values(this.playerUpgradesComponent.upgrades);
  }
  getUpgrade<T extends Upgrade>(t: new () => T): T | null {
    return this.playerUpgradesComponent.getUpgrade(t);
  }

  spendEnergy(amount: number): boolean {
    if (Environment.isDev) {
      return true;
    }
    if (this.scoreComponent.score < amount) {
      return false;
    }
    this.scoreComponent.updateScore(-amount);
    return true;
  }


  onHighlightSpaceChange(
    oldSpace: GridSpace | null,
    newSpace: GridSpace | null
  ) {
    let firstBuilding: Building | null = null;
    if (oldSpace != null) {
      const buildings = oldSpace.children.filter(
        (item) => item instanceof Building
      );
      for (let building of buildings) {
        building.wishScale = 1;
      }
    }
    if (newSpace != null) {
      const buildings = newSpace.children.filter(
        (item) => item instanceof Building
      );
      for (let building of buildings) {
        if (firstBuilding == null) {
          firstBuilding = building;
        }
        building.wishScale = 1.5;
      }
    }

    this.hideTooltip("building-tooltip");
    this._highlightedSpace = newSpace;
    if (firstBuilding != null) {

      let tooltip = firstBuilding.tooltip;
      if (tooltip != null) {
        let tooltipObject = {
          code: "building-tooltip",
          title: firstBuilding.friendlyName,
          description: tooltip,
        }
        this.showTooltip(tooltipObject);
      }
    }
  }
}
