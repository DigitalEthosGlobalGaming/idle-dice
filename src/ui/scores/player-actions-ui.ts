import * as ex from 'excalibur';
import { PlayerAction, playerActions } from '../../player-systems/player-actions';
import { UiElement } from '../ui-element';
import { Label } from '../elements/label';

export class PlayerActionElement extends UiElement {
    playerAction: PlayerAction;
    label!: ex.Label;
    constructor(playerAction: PlayerAction) {
        super();
        this.playerAction = playerAction;
    }

    onInitialize(): void {        
        const sprite = ex.Sprite.from(this.playerAction.image);
        sprite.destSize = {
            width: 64,
            height: 64
        };        
        this.graphics.add('default',sprite);
        this.graphics.use('default');
    }
}

export class PlayerActionsUi extends UiElement{
    playerActions: PlayerAction[];
    constructor(actions?: PlayerAction[]) {
        super();
        actions = actions ?? playerActions;
        this.playerActions = actions;
        this.screenPosition = ex.vec(0, 0.5);

        const test = new Label('Player Actions');
        this.addChild(test);
    }

    onUiUpdate() {
        const uiBounds = this.scene?.camera?.viewport;
        if (uiBounds == null) {
            return;
        }
        const totalWidth = uiBounds.width;
        const centerPosition = totalWidth / 2;
        const elementSize = 64;

        const totalPlayerActions = this.playerActions.length;
        const totalElementSize = totalPlayerActions * elementSize;

    }

}