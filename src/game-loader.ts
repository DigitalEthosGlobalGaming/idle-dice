import * as ex from 'excalibur';
import { Resources } from './resources';

export class GameLoader extends ex.DefaultLoader {

    constructor() {
      super({loadables: Object.values(Resources)});
    }

    override onDraw(ctx: CanvasRenderingContext2D) {
      // Returns the progress of the loader as a number between [0, 1] inclusive.
      ctx.fillText("Preparing Dice", 16,16);
    }


    // override onUpdate(engine: ex.Engine, elapsedMilliseconds: number): void {
    //   // Perform something every tick, for example collect time elapsed or check 
    //   // what file names have been loaded for drawing!
    // }
    
    // override async onUserAction(): Promise<void> {
    //   // Return a promise that resolves when the user interacts with the loading screen in some way,
    //   // usually a click.
    //   //
    //   // It's important to implement this in order to unlock the audio context in the browser.
    //   // Browsers automatically prevent audio from playing until the user performs an action.
       
    // }
    // override async onBeforeLoad(): Promise<void> {
    //   // Overrideable lifecycle method, called directly before loading starts
    //   // Useful if you need to do anything to the screen/viewport
    // }
    // override async onAfterLoad(): Promise<void> {
    //   // Overrideable lifecycle method, called after loading has completed
    //   // Useful if you need to do anything to the screen/viewport
    // }
  }
