import * as ex from "excalibur";
import { GridSystem } from "./grid-system";



export class GridSpace extends ex.Actor {
    grid: GridSystem | null = null;

    constructor(public size: ex.Vector) {
        super({
            pos: new ex.Vector(0, 0),
            width: size.x,
            height: size.y
        });
    
    }

    handleClick: () => void = () => { };

    getBounds(): ex.BoundingBox {
        return new ex.BoundingBox(this.globalPos.x, this.globalPos.y, this.globalPos.x + this.width, this.globalPos.y + this.height);
    }
  
}