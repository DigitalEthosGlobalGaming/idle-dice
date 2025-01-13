import * as ex from 'excalibur';
import { PlayerActionsUi } from '../../player-systems/player-actions-ui';
import { Panel } from '../panel';


export class PlayerUi extends Panel {
    isMoving = false;
    playerActionsUi!: PlayerActionsUi;

    onRender(): void {      
        super.onRender();  
        this.playerActionsUi = this.addPanel(PlayerActionsUi);        
    }
    onPreUpdate(engine: ex.Engine): void {
        const camera = engine.currentScene?.camera;
        if (camera) {
            const viewPort = camera.viewport;
            const targetPosition = ex.vec(viewPort.left + 10, viewPort.top + 10);
            const distance = targetPosition.distance(this.pos);
            if (distance > 0) {
                this.pos = targetPosition;
                // this.actions.clearActions();
                // this.actions.moveTo({
                //     pos: ex.vec(viewPort.left + 10, viewPort.top + 10),
                //     duration: 50,
                //     easing: ex.EasingFunctions.EaseInOutCubic
                // }).die();
            }
        }
    }
}