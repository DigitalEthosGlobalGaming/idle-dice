import * as ex from "excalibur";
import { DiceGameGridSystem } from "./grid-system/grid-system-actor";
import { Player } from "./player";
import { Resources } from "./resources";

export class Level extends ex.Scene {
    score: number = 0;
    best: number = 0;
    random = new ex.Random();
    player!: Player;
    gridSystem: DiceGameGridSystem | null = null; 

    override onActivate(): void {
        Resources.BackgroundMusic.loop = true;
        Resources.BackgroundMusic.play();
        this.gridSystem = new DiceGameGridSystem(new ex.Vector(32, 32), new ex.Vector(32, 32));
        this.add(this.gridSystem);

        this.player = new Player();
        this.add(this.player);
    }

    

    onPreUpdate(engine: ex.Engine, elapsed: number): void {
        super.onPreUpdate(engine, elapsed);
    }

    onPreDraw(ctx: ex.ExcaliburGraphicsContext, elapsed: number): void {
        const gridBounds = this.gridSystem?.getBounds();
        if (gridBounds == null) {
            return;
        }
        const position = gridBounds?.topLeft;
        const width = gridBounds?.width;
        const height = gridBounds?.height;

        const cameraTopLeft = this.camera.viewport.topLeft;
        
        ctx.drawRectangle(position.clone().sub(cameraTopLeft), width, height, ex.Color.Black);
    }


}