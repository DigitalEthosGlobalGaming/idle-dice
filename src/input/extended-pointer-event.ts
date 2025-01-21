import * as ex from "excalibur";
import { InputManager, InputHandler, ButtonStates } from "./input-manager";

export class ExtendedPointerEvent extends ex.PointerEvent {
    inputManager!: InputManager;
    _entities: InputHandler[] | null = null;
    get entities(): InputHandler[] {
        if (this._entities != null) {
            return this._entities;
        }
        let entities = this.getEntities();
        this._entities = entities;
        return entities;
    }

    static extendPointerEvent(
        evt: ex.PointerEvent,
        manager: InputManager
    ): ExtendedPointerEvent {
        if (evt instanceof ExtendedPointerEvent) {
            return evt;
        }
        Object.setPrototypeOf(evt, ExtendedPointerEvent.prototype);

        let extended = evt as ExtendedPointerEvent;
        extended.inputManager = manager;
        return extended;
    }

    private getEntities() {
        const eventPosition = this.worldPos;
        let entitiesGroupedByZIndex: { [key: number]: InputHandler[] } = {};
        let entities = Object.values(this.inputManager.entities ?? {});

        for (let entity of entities) {
            if (entitiesGroupedByZIndex[entity.globalZ] == null) {
                entitiesGroupedByZIndex[entity.globalZ] = [];
            }
            entitiesGroupedByZIndex[entity.globalZ].push(entity);
        }
        let zIndices = Object.keys(entitiesGroupedByZIndex)
            .map((key) => parseInt(key))
            .sort((a, b) => b - a);

        for (let zIndex of zIndices) {
            let entities = entitiesGroupedByZIndex[zIndex];
            let collidedEntities = [];
            for (let entity of entities) {
                if (entity.acceptingInputs !== false) {
                    if (entity.collides(eventPosition)) {
                        collidedEntities.push(entity);
                    }
                }
            }
            if (collidedEntities.length > 0) {
                return collidedEntities;
            }
        }
        return [];
    }

    isDown(button: ButtonStates): boolean {
        return this.inputManager.buttonStates[button] ?? false;
    }
}
