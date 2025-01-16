import * as ex from "excalibur";
import { Level } from "./level";

/**
 * Represents an entity that implements various input handling functions.
 *
 * @property scene - The scene to which this entity belongs.
 * @property onClick - Optional callback function that is triggered when the entity is clicked.
 * @property onPointerDown - Optional callback function that is triggered when a pointer is pressed down on the entity.
 * @property onPointerUp - Optional callback function that is triggered when a pointer is released from the entity.
 * @property onPointerMove - Optional callback function that is triggered when a pointer is moved over the entity.
 * @property collides - Function that checks if a given point collides with the entity.
 * @property globalZ - The global z-index of the entity, used for rendering order.
 */
type RegisterForInput = {
  onClick?(evt: ExtendedPointerEvent): void;
  onPointerDown?(evt: ExtendedPointerEvent): void;
  onPointerUp?(evt: ExtendedPointerEvent): void;
  onPointerMove?(evt: ExtendedPointerEvent): void;
  onPointerEnter?(evt: ExtendedPointerEvent): void;
  onPointerLeave?(evt: ExtendedPointerEvent): void;
  collides(vec: ex.Vector): boolean;
  acceptingInputs?: boolean | ButtonStates[];
  globalZ: number;
};

export type InputHandler = ex.Entity & RegisterForInput;
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

export type ButtonStates = "MouseLeft" | "MouseRight";

export class InputManager extends ex.Entity {
  static InputManagers: InputManager[] = [];
  subscriptions: ex.Subscription[] = [];
  entities: { [key: string]: InputHandler } = {};
  currentHoveredEntities: { [key: string]: InputHandler } = {};
  buttonStates: Record<ButtonStates, boolean> = {
    MouseLeft: false,
    MouseRight: false,
  };

  onAdd(engine: ex.Engine): void {
    if (this.scene?.entities.indexOf(this) === -1) {
      const inputManagers = this.scene?.entities.filter(
        (entity) => entity instanceof InputManager
      );
      if (inputManagers && inputManagers.length > 0) {
        throw new Error("There can only be one InputManager in a scene.");
      }
    }
    if (this.scene instanceof Level) {
      this.scene.inputSystem = this;
    }
    InputManager.InputManagers.push(this);

    this.subscriptions.push(
      engine.input.pointers.primary.on("down", (e) => {
        this.onPointerDown(e);
      })
    );
    this.subscriptions.push(
      engine.input.pointers.primary.on("up", (e) => {
        this.onPointerUp(e);
      })
    );
    this.subscriptions.push(
      engine.input.pointers.primary.on("move", (e) => {
        this.onPointerMove(e);
      })
    );
  }

  onPointerDown(evt: ex.PointerEvent) {
    const mouseButton = ("Mouse" + evt.button.toString()) as ButtonStates;
    if ((mouseButton as string) != "MouseNoButton") {
      this.buttonStates[mouseButton] = true;
    }

    let extendedEvent = ExtendedPointerEvent.extendPointerEvent(evt, this);
    let entities = extendedEvent.entities;
    for (let entity of entities) {
      if (entity.onPointerDown != null) {
        entity.onPointerDown(extendedEvent);
      }
    }

    this.scene?.emit("im-pointer-down", extendedEvent);
  }

  onPointerUp(evt: ex.PointerEvent) {
    const mouseButton = ("Mouse" + evt.button.toString()) as ButtonStates;
    if ((mouseButton as string) != "MouseNoButton") {
      this.buttonStates[mouseButton] = false;
    }
    let extendedEvent = ExtendedPointerEvent.extendPointerEvent(evt, this);
    let entities = extendedEvent.entities;
    for (let entity of entities) {
      if (entity.onPointerUp != null) {
        entity.onPointerUp(extendedEvent);
      }
    }
    this.scene?.emit("im-pointer-up", extendedEvent);
  }

  onPointerMove(evt: ex.PointerEvent) {
    let extendedEvent = ExtendedPointerEvent.extendPointerEvent(evt, this);
    let previousHoveredEntities = this.currentHoveredEntities ?? {};
    this.currentHoveredEntities = {};

    let entities = extendedEvent.entities;

    for (let entity of entities) {
      this.currentHoveredEntities[entity.id] = entity;

      if (entity.onPointerMove != null) {
        entity.onPointerMove(extendedEvent);
      }
      if (!previousHoveredEntities[entity.id]) {
        if (entity.onPointerEnter != null) {
          entity.onPointerEnter(extendedEvent);
        }
      }
      delete previousHoveredEntities[entity.id];
    }
    for (let entity of Object.values(previousHoveredEntities)) {
      if (entity.onPointerLeave != null) {
        entity.onPointerLeave(extendedEvent);
      }
    }

    this.scene?.emit("im-pointer-move", extendedEvent);
  }

  static register(entity: InputHandler): void {
    if (entity.scene == null) {
      throw new Error("Entity has no scene");
    }
    let inputManager: InputManager | null = null;
    if (entity.scene == null) {
      throw new Error("Entity has no scene");
    }
    if (entity.scene != null) {
      if (entity.scene instanceof Level) {
        inputManager = entity.scene.inputSystem ?? null;
      }
    }

    if (inputManager == null) {
      throw new Error("InputManager not found");
    }
    if (entity.acceptingInputs === false) {
      return;
    }

    inputManager.entities[entity.id] = entity;

    entity.on("kill", () => {
      delete inputManager.entities[entity.id];
    });
  }

  override kill(): void {
    super.kill();
    this.subscriptions.forEach((sub) => sub.close());
    this.subscriptions = [];
  }
}
