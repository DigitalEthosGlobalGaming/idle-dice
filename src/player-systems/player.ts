import * as ex from "excalibur";
import { Building } from "../building";
import { Dice } from "../buildings/dice";
import { Roller } from "../buildings/roller";
import { PlayerUpgradesComponent } from "../components/player-upgrades-component";
import { ScoreComponent } from "../components/score-component";
import { Upgrade } from "../components/upgrade-component";
import { Ghost } from "../ghost";
import { GridSpace } from "../grid-system/grid-space";
import { ExtendedPointerEvent } from "../input-manager";
import { GameScene } from "../scenes/game.scene";
import { PlayerUi } from "../ui/scores/player-ui";
import {
  playerActions,
  PlayerActions,
  PlayerActionTypes,
} from "./player-actions";
import { Tooltip } from "./player-tooltip";
import { PassiveEnergyComponent } from "../components/upgrades/passive-energy.upgrade";

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
  REMOVE: 0,
  UPGRADES: 0,
};

export class Player extends ex.Actor {
  scoreComponent!: ScoreComponent;
  playerUpgradesComponent!: PlayerUpgradesComponent;
  cameraPos = ex.vec(0, 0);
  pointerStates: { [key: number]: MouseState } = [];
  ghost!: Ghost;
  draggingBuilding: Building | null = null;
  playerUi!: PlayerUi;

  cameraMovementData: CameraMovementData | null = null;
  wishPosition = ex.vec(0, 0);
  isSetup = false;

  _currentAction: PlayerActions = PlayerActions.NONE;
  get currentAction() {
    return this._currentAction;
  }
  set currentAction(value: PlayerActions) {
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

  onAdd(): void {
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
      this.scoreComponent.score = 10;
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
      let cost = costs[this.currentAction];
      if (this.spendEnergy(cost)) {
        if (this.currentAction == PlayerActions.NEWDICE) {
          const faces = 6;
          existingBuilding = new Dice(faces, 1);
          space.addChild(existingBuilding);
          existingBuilding.onBuild();
        }
        if (this.currentAction == PlayerActions.NEWROLLER) {
          const entity = new Roller();
          space.addChild(entity);
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
    this.tooltips.push(value);
    this.updateTooltip();
  }

  hideTooltip(value: Tooltip) {
    this.tooltips = this.tooltips.filter((t) => t.code != value.code);
    this.updateTooltip();
  }
  get upgrades(): Upgrade[] {
    return Object.values(this.playerUpgradesComponent.upgrades);
  }
  getUpgrade<T extends Upgrade>(t: new (...args: any[]) => T): T | null {
    return this.playerUpgradesComponent.getUpgrade(t);
  }

  spendEnergy(amount: number): boolean {
    if (this.scoreComponent.score < amount) {
      return false;
    }
    this.scoreComponent.updateScore(-amount);
    return true;
  }

}
