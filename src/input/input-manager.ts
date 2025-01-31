import * as ex from "excalibur";
import { Level } from "@src/level";
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

export type ButtonStates = "MouseLeft" | "MouseRight" | ex.Keys;

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
  showDebug = false;
  subscriptions: ex.Subscription[] = [];
  entities: { [key: string]: InputHandler } = {};
  currentHoveredEntities: { [key: string]: InputHandler } = {};
  buttonStates: Record<ButtonStates, boolean> = {
    MouseLeft: false,
    MouseRight: false,
    [ex.Keys.Backquote]: false,
    [ex.Keys.Backslash]: false,
    [ex.Keys.BracketLeft]: false,
    [ex.Keys.BracketRight]: false,
    [ex.Keys.Comma]: false,
    [ex.Keys.Key0]: false,
    [ex.Keys.Key1]: false,
    [ex.Keys.Key2]: false,
    [ex.Keys.Key3]: false,
    [ex.Keys.Key4]: false,
    [ex.Keys.Key5]: false,
    [ex.Keys.Key6]: false,
    [ex.Keys.Key7]: false,
    [ex.Keys.Key8]: false,
    [ex.Keys.Key9]: false,
    [ex.Keys.Equal]: false,
    [ex.Keys.IntlBackslash]: false,
    [ex.Keys.IntlRo]: false,
    [ex.Keys.IntlYen]: false,
    [ex.Keys.A]: false,
    [ex.Keys.B]: false,
    [ex.Keys.C]: false,
    [ex.Keys.D]: false,
    [ex.Keys.E]: false,
    [ex.Keys.F]: false,
    [ex.Keys.G]: false,
    [ex.Keys.H]: false,
    [ex.Keys.I]: false,
    [ex.Keys.J]: false,
    [ex.Keys.K]: false,
    [ex.Keys.L]: false,
    [ex.Keys.M]: false,
    [ex.Keys.N]: false,
    [ex.Keys.O]: false,
    [ex.Keys.P]: false,
    [ex.Keys.Q]: false,
    [ex.Keys.R]: false,
    [ex.Keys.S]: false,
    [ex.Keys.T]: false,
    [ex.Keys.U]: false,
    [ex.Keys.V]: false,
    [ex.Keys.W]: false,
    [ex.Keys.X]: false,
    [ex.Keys.Y]: false,
    [ex.Keys.Z]: false,
    [ex.Keys.Minus]: false,
    [ex.Keys.Period]: false,
    [ex.Keys.Quote]: false,
    [ex.Keys.Semicolon]: false,
    [ex.Keys.Slash]: false,
    [ex.Keys.AltLeft]: false,
    [ex.Keys.AltRight]: false,
    [ex.Keys.Alt]: false,
    [ex.Keys.AltGraph]: false,
    [ex.Keys.Backspace]: false,
    [ex.Keys.CapsLock]: false,
    [ex.Keys.ContextMenu]: false,
    [ex.Keys.ControlLeft]: false,
    [ex.Keys.ControlRight]: false,
    [ex.Keys.Enter]: false,
    [ex.Keys.MetaLeft]: false,
    [ex.Keys.MetaRight]: false,
    [ex.Keys.ShiftLeft]: false,
    [ex.Keys.ShiftRight]: false,
    [ex.Keys.Space]: false,
    [ex.Keys.Tab]: false,
    [ex.Keys.Convert]: false,
    [ex.Keys.KanaMode]: false,
    [ex.Keys.NonConvert]: false,
    [ex.Keys.Delete]: false,
    [ex.Keys.End]: false,
    [ex.Keys.Help]: false,
    [ex.Keys.Home]: false,
    [ex.Keys.Insert]: false,
    [ex.Keys.PageDown]: false,
    [ex.Keys.PageUp]: false,
    [ex.Keys.Up]: false,
    [ex.Keys.Down]: false,
    [ex.Keys.Left]: false,
    [ex.Keys.Right]: false,
    [ex.Keys.NumLock]: false,
    [ex.Keys.Numpad0]: false,
    [ex.Keys.Numpad1]: false,
    [ex.Keys.Numpad2]: false,
    [ex.Keys.Numpad3]: false,
    [ex.Keys.Numpad4]: false,
    [ex.Keys.Numpad5]: false,
    [ex.Keys.Numpad6]: false,
    [ex.Keys.Numpad7]: false,
    [ex.Keys.Numpad8]: false,
    [ex.Keys.Numpad9]: false,
    [ex.Keys.NumAdd]: false,
    [ex.Keys.NumDecimal]: false,
    [ex.Keys.NumDivide]: false,
    [ex.Keys.NumEnter]: false,
    [ex.Keys.NumMultiply]: false,
    [ex.Keys.NumSubtract]: false,
    [ex.Keys.Esc]: false,
    [ex.Keys.F1]: false,
    [ex.Keys.F2]: false,
    [ex.Keys.F3]: false,
    [ex.Keys.F4]: false,
    [ex.Keys.F5]: false,
    [ex.Keys.F6]: false,
    [ex.Keys.F7]: false,
    [ex.Keys.F8]: false,
    [ex.Keys.F9]: false,
    [ex.Keys.F10]: false,
    [ex.Keys.F11]: false,
    [ex.Keys.F12]: false,
    [ex.Keys.F13]: false,
    [ex.Keys.F14]: false,
    [ex.Keys.F15]: false,
    [ex.Keys.F16]: false,
    [ex.Keys.F17]: false,
    [ex.Keys.F18]: false,
    [ex.Keys.F19]: false,
    [ex.Keys.F20]: false,
    [ex.Keys.PrintScreen]: false,
    [ex.Keys.ScrollLock]: false,
    [ex.Keys.Pause]: false,
    [ex.Keys.Unidentified]: false
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

  _paused: boolean = false;
  set paused(value: boolean) {
    this._paused = value;
  }

  get paused(): boolean {
    return !this.isInCurrentScene || this._paused;
  }

  get isInCurrentScene(): boolean {
    return this.scene?.isCurrentScene() ?? false;
  }

  onPointerDown(evt: ex.PointerEvent) {
    if (this.paused) {
      return;
    }
    const mouseButton = ("Mouse" + evt.button.toString()) as ButtonStates;
    if ((mouseButton as string) != "MouseNoButton") {
      this.buttonStates[mouseButton] = true;
    }

    let extendedEvent = ExtendedPointerEvent.extend(evt, this);

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
    if (this.paused) {
      return;
    }
    const mouseButton = ("Mouse" + evt.button.toString()) as ButtonStates;
    if ((mouseButton as string) != "MouseNoButton") {
      this.buttonStates[mouseButton] = false;
    }
    let extendedEvent = ExtendedPointerEvent.extend(evt, this);
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
    if (this.paused) {
      return;
    }
    let extendedEvent = ExtendedPointerEvent.extend(evt, this);

    if (this.showDebug) {
      this.level.drawDebug({
        id: "im-debug-pointer-move",
        type: "circle",
        pos: evt.worldPos,
        radius: 5,
      });
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
      if (entity.isKilled()) {
        continue;
      }
      if (entity.onPointerLeave != null) {
        entity.onPointerLeave(extendedEvent);
        entity.emit(InputManager.Events.pointerLeave, extendedEvent);
      }
    }

    this.scene?.emit(InputManager.Events.pointerMove, extendedEvent);
  }

  onKeyUp(evt: ex.KeyEvent) {
    if (this.paused) {
      return;
    }

    this.buttonStates[evt.key] = false;
    let extendedEvent = ExtendedKeyEvent.extend(evt, this);
    let entities = Object.values(this.entities);
    this.level.onKeyUp(extendedEvent);
    for (let entity of entities) {
      if (entity.onKeyUp != null) {
        entity.onKeyUp(extendedEvent);
      }
      entity.emit(InputManager.Events.keyUp, extendedEvent);
    }
    if (evt.key == "Space") {
      const actorGroups: Record<string, ex.Actor[]> = {};
      this.scene?.actors.forEach((actor) => {
        if (actorGroups[actor.constructor.name] == null) {
          actorGroups[actor.constructor.name] = [];
        }
        actorGroups[actor.constructor.name].push(actor);
      });
      console.table(actorGroups, ["length"]);
    }
  }

  onKeyDown(evt: ex.KeyEvent) {
    if (this.paused) {
      return;
    }
    this.buttonStates[evt.key] = true
    let extendedEvent = ExtendedKeyEvent.extend(evt, this);
    this.level.onKeyDown(extendedEvent);
    let entities = Object.values(this.entities);
    for (let entity of entities) {
      if (entity.onKeyDown != null) {
        entity.onKeyDown(extendedEvent);
      }
      entity.emit(InputManager.Events.keyDown, extendedEvent);
    }
  }

  onKeyPress(evt: ex.KeyEvent) {
    if (this.paused) {
      return;
    }
    let extendedEvent = ExtendedKeyEvent.extend(evt, this);
    let entities = Object.values(this.entities);
    for (let entity of entities) {
      if (entity.onKeyPress != null) {
        entity.onKeyPress(extendedEvent);
        entity.emit(InputManager.Events.keyPress, extendedEvent);
      }
    }
  }

  isDown(button: ButtonStates): boolean {
    return this.buttonStates[button];
  }


  static unregister(entity: InputHandler, scene: ex.Scene): void {
    if (entity.scene == null) {
      throw new Error("Entity has no scene");
    }
    if (!(scene instanceof Level)) {
      throw new Error("Scene is not a Level");
    }
    let inputManager = scene.inputSystem;
    delete inputManager.entities[entity.id];
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
