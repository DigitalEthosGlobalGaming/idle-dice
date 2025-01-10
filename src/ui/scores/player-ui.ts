import * as ex from 'excalibur';

export class PlayerUi extends ex.Actor {
    isMoving = false;

    onPreUpdate(engine: ex.Engine, elapsed: number): void {
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