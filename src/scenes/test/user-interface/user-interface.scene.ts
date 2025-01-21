import { ExtendedKeyEvent } from "@src/input/extended-key-event";
import { InputHandler, InputManager } from "@src/input/input-manager";
import { Level } from "@src/level";
import { Panel } from "@src/ui/panel";
import * as ex from "excalibur";
import { TestLabelPanel } from "./test-label";
import { TestPanelContainer } from "./test-panel-container";
import { TestListPanel } from "./test-list";
import { TestButtonPanel } from "./test-button";

export const Scenes: Record<string, string> = {
  Play: "GameScene",
  Updates: "UpdatesScene",
  Help: "HowToPlayScene",
  Credits: "CreditScene",
};

class Controller extends ex.Entity implements InputHandler {

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    InputManager.register(this);
  }

  onKeyUp(evt: ExtendedKeyEvent): void {
    let scene = this.scene;
    if (!(scene instanceof TestUserInterfaceScene)) {
      return
    }
    if (evt.key == ex.Keys.ArrowUp) {
      scene.testId++;
    }
    if (evt.key == ex.Keys.Escape) {
      scene.engine.goToScene("WelcomeScene");
    }
  }
  collides(_vec: ex.Vector): boolean {
    return false;
  }
  globalZ: number = 0;

}



export class TestUserInterfaceScene extends Level {
  currentTestPanel?: Panel;
  testPanelsClasses = [
    TestPanelContainer,
    TestLabelPanel,
    TestListPanel,
    TestButtonPanel
  ]
  _testId: number = 3;
  get testId(): number {
    return this._testId;
  }
  set testId(value: number) {
    if (value < 0) {
      value = this.testPanelsClasses.length;
    }
    if (value >= this.testPanelsClasses.length) {
      value = 0;
    }

    if (this._testId != value) {
      this._testId = value;
      this.startTest();
    }
  }

  startTest() {
    if (this.currentTestPanel != null) {
      this.currentTestPanel.kill();
    }
    let currentClass = this.testPanelsClasses[this.testId];
    let newPanel = new currentClass();
    if (newPanel == undefined) {
      throw new Error("Panel is undefined");
    }
    this.add(newPanel);
    this.currentTestPanel = newPanel;
    console.log("STARTING NEW PANEL");
  }

  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    this.add(new Controller());
    this.startTest();
  }


  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    for (let entity of this.entities) {
      entity.kill();
    }
  }
}
