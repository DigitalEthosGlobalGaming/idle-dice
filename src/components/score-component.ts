import * as ex from 'excalibur';
import { FloatingScore } from '../ui/scores/floating-score';
import { BaseComponent } from './base-component';

export class ScoreComponent extends BaseComponent {
    private score: number;
    private scoreLabel: ex.Label;

    constructor() {
        super();
        this.score = 0;
        this.scoreLabel = new ex.Label({
            text: `Score: ${this.score}`,
            pos: new ex.Vector(10, 10),
            font: new ex.Font({
                family: 'Arial',
                size: 24,
                color: ex.Color.White
            })
        });
    }
    

    public updateScore(points: number) {
        this.setScore(this.score + points);
    }

    public setScore(points: number) {
        this.score = points;
        if (this.scoreLabel.parent == null) {
            const ui = this.getUi();
            ui.addChild(this.scoreLabel)
        }
        this.scoreLabel.text = `Score: ${this.score}`;
    }
    
    public createScore(creator: ex.Actor, value: number) {
        if (this.owner == null) {
            throw new Error("Owner is null");
        }
        const pos = creator.globalPos;
        const floatingScore = new FloatingScore(pos,this.scoreLabel.globalPos);
        this.owner.scene?.engine.add(floatingScore);
        floatingScore.addScore(value).then((value) => { this.updateScore(value); });
    }
}