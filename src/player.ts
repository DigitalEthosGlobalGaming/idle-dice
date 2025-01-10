import * as ex from "excalibur";
import { Level } from "./level";
import { Dice } from "./dice";
import { Building } from "./building";
import { Ghost } from "./ghost";
import { PlayerUi } from "./ui/scores/player-ui";
import { ScoreComponent } from "./components/score-component";

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
}

export class Player extends ex.Actor {
    scoreComponent!: ScoreComponent
    cameraPos = ex.vec(0, 0);
    pointerStates: { [key: number]: MouseState } = [];
    ghost!: Ghost;
    draggingBuilding: Building | null = null;
    playerUi!: PlayerUi;

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

    onInitialize(engine: ex.Engine): void {
        this.ghost = new Ghost();
        this.addChild(this.ghost);
        this.scoreComponent = new ScoreComponent();
        this.addComponent(this.scoreComponent);
        this.playerUi = new PlayerUi();
        this.getScene().add(this.playerUi);
    }

    getEngine(): ex.Engine {
        return this.getScene().engine;
    }

    onMouseDown(state: MouseState) {
        console.log('down');
    }

    onPress(state: MouseState) {

    }

    onLongPress(state: MouseState) {

    }

    onMouseUp(state: MouseState) {
        if (this.draggingBuilding != null) {
            const newSpace = this.getScene().gridSystem?.getSpaceFromWorldPosition(state.pos);
            const building = newSpace?.children.find(c => c instanceof Building) as Building;
            if (building == null) {
                const oldSpace = this.getScene().gridSystem?.getSpaceFromWorldPosition(this.draggingBuilding.pos);
                this.draggingBuilding.unparent();
                oldSpace?.removeChild(this.draggingBuilding);
                newSpace?.addChild(this.draggingBuilding);

            }
            this.draggingBuilding = null;
            this.ghost.clear();
            return;
        }

        if (!state.dragging) {
            this.placeDice(state.pos);
        }
    }

    handlePointers() {
        const engine = this.getEngine();
        const now = Date.now();
        const pointers = engine.input.pointers;
        const pointerLength = pointers.count();
        for (let i = 0; i < pointerLength; i++) {
            const pointer = pointers.at(i);
            let state = this.pointerStates[i];
            if (state == null) {
                state = {
                    button: 0,
                    pos: ex.vec(pointer.lastWorldPos.x, pointer.lastWorldPos.y),
                    isDown: false,
                    downPos: ex.vec(pointer.lastWorldPos.x, pointer.lastWorldPos.y),
                    pointer: pointer,
                    downDelta: ex.vec(0, 0),
                    dragging: false,
                    downStartTick: now,
                    downDuration: 0
                };
            }

            const isDown = pointers.isDown(i);
            state.pos = ex.vec(pointer.lastWorldPos.x, pointer.lastWorldPos.y);
            let didDownChange = state.isDown != isDown;

            if (didDownChange) {
                state.isDown = isDown;
                if (isDown) {
                    state.downStartTick = now;
                }
            }

            if (isDown) {
                state.downDuration = now - state.downStartTick;
                if (didDownChange) {
                    state.downPos = ex.vec(pointer.lastWorldPos.x, pointer.lastWorldPos.y);
                }
                state.downDelta = state.pos.sub(state.downPos);

                if (state.downDelta.magnitude > 2) {
                    state.dragging = true;
                }
            }

            if (!isDown) {
                if (didDownChange) {
                    this.onMouseUp(state);
                    state.dragging = false;
                    state.downStartTick = now;
                }
            } else {
                if (didDownChange) {
                    this.onMouseDown(state);
                }
            }

            this.pointerStates[i] = state;
        }
        return this.pointerStates;
    }

    onPreUpdate(engine: ex.Engine, elapsed: number): void {
        super.onPreUpdate(engine, elapsed);
        this.handlePointers();
        const primaryPointer = this.pointerStates[0];
        if (primaryPointer == null) {
            return;
        }

        const currentSpace = this.getScene().gridSystem?.getSpaceFromWorldPosition(primaryPointer.pos);

        if (primaryPointer.isDown) {
            const isLongDown = primaryPointer.downDuration > 300;
            const movingBuilding = this.draggingBuilding != null;
            this.ghost.setFrom(this.draggingBuilding);
            if (this.draggingBuilding != null) {
                this.ghost.pos = primaryPointer.pos;
            }

            if (!movingBuilding) {
                if (primaryPointer.dragging) {
                    this.cameraPos.x -= primaryPointer.downDelta.x;
                    this.cameraPos.y -= primaryPointer.downDelta.y;
                    this.getCamera().pos = this.cameraPos;
                } else {
                    if (isLongDown) {
                        this.draggingBuilding = currentSpace?.children.find(c => c instanceof Building) as Building;
                    }
                }
            }
        }
        
        this.pos = this.cameraPos;

    }

    placeDice(worldPosition: ex.Vector) {
        const space = this.getScene().gridSystem?.getSpaceFromWorldPosition(worldPosition);
        if (space == null) {
            return;
        }
        let dice = space.children.find(c => c instanceof Building);
        if (dice == null) {
            const faces = 6;
            dice = new Dice(faces, 1);
            space.addChild(dice);
            dice.onBuild();
        } else {
            if (dice instanceof Dice) {
                dice.rollDice();
            }
        }
    }

}