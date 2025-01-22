import * as ex from "excalibur";
import { Level } from "@src/input/../level";
import { ExtendedPointerEvent } from "./extended-pointer-event";
import { ExtendedKeyEvent } from "./extended-key-event";

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
  onKeyUp?(evt: ExtendedKeyEvent): void;
  onKeyDown?(evt: ExtendedKeyEvent): void;
  onKeyPress?(evt: ExtendedKeyEvent): void;
  collides(vec: ex.Vector): boolean;
  acceptingInputs?: boolean | ButtonStates[];
  globalZ: number;
};

export type InputHandler = ex.Entity & RegisterForInput;

export type ButtonStates = "MouseLeft" | "MouseRight";

export class InputManager extends ex.Entity {
  static InputManagers: InputManager[] = [];
  static Events = {
    pointerDown: "im-pointer-down",
    pointerUp: "im-pointer-up",
    pointerMove: "im-pointer-move",
    keyPress: "im-key-press",
    keyDown: "im-key-down",
    keyUp: "im-key-up",
    hoverChange: "im-hover-change",
    pointerEnter: "im-pointer-enter",
    pointerLeave: "im-pointer-leave",
  };
  showDebug = true;
  subscriptions: ex.Subscription[] = [];
  entities: { [key: string]: InputHandler } = {};
  currentHoveredEntities: { [key: string]: InputHandler } = {};
  buttonStates: Record<ButtonStates, boolean> = {
    MouseLeft: false,
    MouseRight: false,
  };

  get level(): Level {
    if (!(this.scene instanceof Level)) {
      throw new Error("InputManager must be added to a Level scene.");
    }
    return this.scene as Level;
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    const level = this.level;
    if (level.entities.indexOf(this) === -1) {
      const inputManagers = level.entities.filter(
        (entity) => entity instanceof InputManager
      );
      if (inputManagers && inputManagers.length > 0) {
        throw new Error("There can only be one InputManager in a scene.");
      }
    }
    this.level.inputSystem = this;
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
    this.subscriptions.push(
      engine.input.keyboard.on("up", (e: any) => {
        this.onKeyUp(e);
      })
    );
    this.subscriptions.push(
      engine.input.keyboard.on("down", (e: any) => {
        this.onKeyDown(e);
      })
    );
    this.subscriptions.push(
      engine.input.keyboard.on("press", (e: any) => {
        this.onKeyPress(e);
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
      entity.emit(InputManager.Events.pointerDown, extendedEvent);
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

      entity.emit(InputManager.Events.pointerUp, extendedEvent);
    }
    this.scene?.emit("im-pointer-up", extendedEvent);
  }

  onPointerMove(evt: ex.PointerEvent) {
    let extendedEvent = ExtendedPointerEvent.extendPointerEvent(evt, this);

    if (this.showDebug) {
      const mouseBounds = new ex.BoundingBox(
        evt.worldPos.x,
        evt.worldPos.y,
        evt.worldPos.x + 5,
        evt.worldPos.y + 5
      );
      this.level.drawDebug(mouseBounds, "im-pointer-move");
    }

    let previousHoveredEntities = this.currentHoveredEntities ?? {};
    this.currentHoveredEntities = {};

    let entities = extendedEvent.entities;

    for (let entity of entities) {
      this.currentHoveredEntities[entity.id] = entity;

      if (entity.onPointerMove != null) {
        entity.onPointerMove(extendedEvent);
      }
      entity.emit(InputManager.Events.pointerMove, extendedEvent);
      if (!previousHoveredEntities[entity.id]) {
        if (entity.onPointerEnter != null) {
          entity.onPointerEnter(extendedEvent);
        }
        entity.emit(InputManager.Events.pointerEnter, extendedEvent);
      }
      delete previousHoveredEntities[entity.id];
    }
    for (let entity of Object.values(previousHoveredEntities)) {
      if (entity.onPointerLeave != null) {
        entity.onPointerLeave(extendedEvent);
        entity.emit(InputManager.Events.pointerLeave, extendedEvent);
      }
    }

    this.scene?.emit(InputManager.Events.pointerMove, extendedEvent);
  }

  onKeyUp(evt: ex.KeyEvent) {
    let extendedEvent = ExtendedKeyEvent.extendPointerEvent(evt, this);
    let entities = Object.values(this.entities);
    for (let entity of entities) {
      if (entity.onKeyUp != null) {
        entity.onKeyUp(extendedEvent);
      }
      entity.emit(InputManager.Events.keyUp, extendedEvent);
    }
  }

  onKeyDown(evt: ex.KeyEvent) {
    let extendedEvent = ExtendedKeyEvent.extendPointerEvent(evt, this);
    let entities = Object.values(this.entities);
    for (let entity of entities) {
      if (entity.onKeyDown != null) {
        entity.onKeyDown(extendedEvent);
      }
      entity.emit(InputManager.Events.keyDown, extendedEvent);
    }
  }

  onKeyPress(evt: ex.KeyEvent) {
    let extendedEvent = ExtendedKeyEvent.extendPointerEvent(evt, this);
    let entities = Object.values(this.entities);
    for (let entity of entities) {
      if (entity.onKeyPress != null) {
        entity.onKeyPress(extendedEvent);
        entity.emit(InputManager.Events.keyPress, extendedEvent);
      }
    }
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

    let isNew = inputManager.entities[entity.id] == null;
    if (isNew) {
      inputManager.entities[entity.id] = entity;

      entity.on("kill", () => {
        delete inputManager.entities[entity.id];
      });
    }
  }

  override kill(): void {
    super.kill();
    this.subscriptions.forEach((sub) => sub.close());
    this.subscriptions = [];
  }
}
