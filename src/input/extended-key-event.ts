import * as ex from "excalibur";
import { ButtonStates, InputManager } from "./input-manager";

export class ExtendedKeyEvent extends ex.KeyEvent {
    inputManager!: InputManager;

    static extendPointerEvent(
        evt: ex.KeyEvent,
        manager: InputManager
    ): ExtendedKeyEvent {
        if (evt instanceof ExtendedKeyEvent) {
            return evt;
        }
        Object.setPrototypeOf(evt, ExtendedKeyEvent.prototype);

        let extended = evt as ExtendedKeyEvent;
        extended.inputManager = manager;
        return extended;
    }



    isDown(button: ButtonStates): boolean {
        return this.inputManager.buttonStates[button] ?? false;
    }
}
