import * as ex from "excalibur";
import { FloatingScore } from "@src/ui/scores/floating-score";
import { BaseComponent } from "./base-component";
import { Player } from "@src/player-systems/player";

export class ScoreComponent extends BaseComponent {
  private _score: number;
  private scoreLabel: ex.Label;

  constructor() {
    super();
    this._score = 10;
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

  onAdd(owner: ex.Entity): void {
    super.onAdd?.(owner);
    if (owner instanceof Player) {
      this.score = owner._score;
    }
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
    this.scoreLabel.text = `Energy: ${Math.floor(this._score)}⚡︎`;
  }

  public updateScore(points: number) {
    this.score += points;
  }

  public createScore(creator: ex.Actor, value: number) {
    if (this.owner == null) {
      throw new Error("Owner is null");
    }

    if (FloatingScore.numberOfInstances >= 50) {
      this.updateScore(value);
      return;
    }

    const pos = creator.globalPos;
    const floatingScore = new FloatingScore(pos, this.scoreLabel.globalPos);
    this.owner.scene?.engine.add(floatingScore);

    FloatingScore.numberOfInstances += 1;
    floatingScore.addScore(value).then((value) => {
      this.updateScore(value);
      FloatingScore.numberOfInstances -= 1;
    });
  }
}
