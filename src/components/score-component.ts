import * as ex from "excalibur";
import { FloatingScore } from "@src/ui/scores/floating-score";
import { BaseComponent } from "./base-component";
import { Player } from "@src/player-systems/player";

export class ScoreComponent extends BaseComponent {
  private _score: number;
  private _previousScore: number = -10;
  private _scorePerMinute: number = 0;
  private scoreLabel: ex.Label | null = null;

  timer: ex.Timer | null = null;


  constructor() {
    super();
    this._score = 10;
  }

  onAdd(owner: ex.Entity): void {
    super.onAdd?.(owner);
    if (owner instanceof Player) {
      this.renderScore();
      this.score = owner._score;
      if (this.timer == null) {
        this.timer = new ex.Timer({
          fcn: () => {
            this.renderScore();
          },
          interval: 100,
          repeats: true,
        });
        owner.scene?.addTimer(this.timer);
        this.timer.start();
      }
    }
  }

  get scorePerMinute(): number {
    return this._scorePerMinute;
  }

  public get score(): number {
    return this._score;
  }

  public set score(value: number) {
    this._score = Math.floor(value);
  }

  renderScore() {
    if (this._previousScore == this._score) {
      return;
    }
    if (this.scoreLabel == null) {
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
    if (this.scoreLabel.parent == null) {
      const ui = this.getUi();
      ui.addChild(this.scoreLabel);
    }
    this._previousScore = this._score;
    const prestigePoints = this.player?.getData("prestige-points") ?? 0;
    let text = `Energy: ${Math.floor(this._score)}⚡︎`;
    if (prestigePoints > 0) {
      text += `\n${prestigePoints}⏣`;
    }
    this.scoreLabel.text = text;
  }

  public updateScore(points: number) {
    this.score += points;
    const key = "current-prestige-score";
    let scoreThisPrestige = this.player?.getData(key) ?? 0;
    this.player?.setData(key, scoreThisPrestige + points);

    this.player?.setData('lifetime-energy', (this.player.getData('lifetime-energy') ?? 0) + points);
  }

  public createScore(creator: ex.Actor, value: number) {
    if (this.owner == null) {
      throw new Error("Owner is null");
    }
    const engine = this.owner.scene?.engine;
    if (!engine) return;

    const fps = engine.stats.currFrame.fps ?? 60;
    const maxInstances = Math.max(5, Math.floor(fps / 2));
    const numberOfInstances = Math.min(50, maxInstances);

    if (FloatingScore.numberOfInstances >= numberOfInstances || this.scoreLabel == null) {
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
