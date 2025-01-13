import * as ex from "excalibur";

function getBoundsOfElement(element: ex.Actor) {
    if (element instanceof ex.Label) {
        return {
            width: element.getTextWidth(),
            height: element.height
        }
    }
}

export class UiElement extends ex.Actor {
    screenPosition: ex.Vector = new ex.Vector(0.5,0.5);
    constructor() {
        super();
    }


    onUiRerender() {
        
    }

    onInitialize(): void {
        this.onUiRerender();
    }

    getParent(): UiElement | null {
        let parent = this.parent;
        if (parent instanceof UiElement) {
            return parent;
        }
        return null;
    }

    getBounds() {
        
        return {
            width: this.width,
            height: this.height
        }
    }

    getParentBounds(): ex.BoundingBox | null {
        let parent = this.getParent();
        if (parent == null) {
            return null;
        }

        return this.scene?.camera?.viewport ?? null;
    }

    onPreUpdate(engine: ex.Engine): void {
        const position = this.screenPosition.normalize();
        const bounds = this.getParentBounds();
        if (bounds == null) {
            return;
        }

        position.x = position.x * bounds.width;
        position.y = position.y * bounds.height;
        this.pos = position;        
    }
}