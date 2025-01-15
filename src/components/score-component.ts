import * as ex from "excalibur";
import { FloatingScore } from "../ui/scores/floating-score";
import { BaseComponent } from "./base-component";

export class ScoreComponent extends BaseComponent {
  private _score: number;
  private scoreLabel: ex.Label;

  constructor() {
    super();
    this._score = 0;
    this.scoreLabel = new ex.Label({
      text: `Energy: ${this._score}`,
      pos: new ex.Vector(10, 10),
      font: new ex.Font({
        family: "ds-digi",
        size: 24,
        color: ex.Color.White,
      }),
    });
  }

  public get score(): number {
    return this._score;
  }

  public set score(value: number) {
    this._score = value;
    if (this.scoreLabel.parent == null) {
      const ui = this.getUi();
      ui.addChild(this.scoreLabel);
    }
    this.scoreLabel.text = `Energy: ${this._score}`;
  }

  public updateScore(points: number) {
    this.score += points;
  }

  public createScore(creator: ex.Actor, value: number) {
    if (this.owner == null) {
      throw new Error("Owner is null");
    }
    const pos = creator.globalPos;
    const floatingScore = new FloatingScore(pos, this.scoreLabel.globalPos);
    this.owner.scene?.engine.add(floatingScore);
    floatingScore.addScore(value).then((value) => {
      this.updateScore(value);
    });
  }
}
