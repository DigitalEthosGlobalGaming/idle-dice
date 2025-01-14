import * as ex from "excalibur";
import { Building } from "../building";
import { Dice } from "../buildings/dice";
import { Roller } from "../buildings/roller";
import { ScoreComponent } from "../components/score-component";
import { Ghost } from "../ghost";
import { GridSpace } from "../grid-system/grid-space";
import { ExtendedPointerEvent } from "../input-manager";
import { Level } from "../level";
import { PlayerUi } from "../ui/scores/player-ui";
import { PlayerActions } from "./player-actions";

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
};

export class Player extends ex.Actor {
  scoreComponent!: ScoreComponent;
  cameraPos = ex.vec(0, 0);
  pointerStates: { [key: number]: MouseState } = [];
  ghost!: Ghost;
  draggingBuilding: Building | null = null;
  playerUi!: PlayerUi;
  currentAction: PlayerActions = PlayerActions.NONE;
  cameraMovementData: CameraMovementData | null = null;
  wishPosition = ex.vec(0, 0);

  getCamera(): ex.Camera {
    if (this.scene == null) {
      throw new Error("Scene is null");
    }
    return this.scene?.camera;
  }

  getScene(): Level {
    if (this.scene == null) {
      throw new Error("Scene is null");
    }
    if (!(this.scene instanceof Level)) {
      throw new Error("Scene is not a Level");
    }
    return this.scene;
  }

  onAdd(): void {
    this.ghost = new Ghost();
    this.addChild(this.ghost);
    this.scoreComponent = new ScoreComponent();
    this.addComponent(this.scoreComponent);
    this.playerUi = new PlayerUi();
    this.addChild(this.playerUi);
    this.scoreComponent.score = 10;

    this.scene?.on("im-pointer-down", (e) => {
      this.onPointerDown(e as ExtendedPointerEvent);
    });
    this.scene?.on("im-pointer-move", (e) => {
      this.onPointerMove(e as ExtendedPointerEvent);
    });
    this.scene?.on("im-pointer-up", (e) => {
      this.onPointerUp(e as ExtendedPointerEvent);
    });
  }

  onPointerMove(e: ExtendedPointerEvent) {
    if (e.isDown("MouseLeft")) {
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

  onPointerDown(_e: ExtendedPointerEvent) {}

  onPointerUp(_e: ExtendedPointerEvent) {
    this.cameraMovementData = null;
  }

  onSpaceClicked(space: GridSpace) {
    if (this.cameraMovementData == null) {
      this.placeBuildable(space.globalPos);
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

  placeBuildable(worldPosition: ex.Vector) {
    const space =
      this.getScene().gridSystem?.getSpaceFromWorldPosition(worldPosition);
    if (space == null) {
      return;
    }
    let existingBuilding = space.children.find((c) => c instanceof Building);
    if (existingBuilding == null) {
      let cost = costs[this.currentAction];
      if (this.scoreComponent.score < cost) {
        return;
      }
      this.scoreComponent.updateScore(-cost);
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
    } else {
      if (existingBuilding instanceof Dice) {
        existingBuilding.rollDice();
      }
    }
  }
}
