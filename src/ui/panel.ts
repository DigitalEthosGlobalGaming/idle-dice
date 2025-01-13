import * as ex from "excalibur";

export class Panel extends ex.Actor {
    lastRenderTick = -1;
    isHovered = false;
    isMouseDown = false;
    

    constructor() {
        super();
    }

    onInitialize(): void {
        this.render();
        this.attachEvents();
    }

    attachEvents() {
        this.on('pointerup', (e) => { this.onPointerUp(e) });
        this.on('pointerdown', (e) => { this.onPointerDown(e) });
        this.on('pointerenter', (e) => { this.onPointerEnter(e) });
        this.on('pointerleave', (e) => { this.onPointerLeave(e) });
    }

    onPointerLeave(_e: ex.PointerEvent): void {
        if (!this.isHovered) {
            return;
        }
        this.isHovered = false;
        this.onHoverChanged();
    }

    onPointerEnter(_e: ex.PointerEvent): void {
        if (this.isHovered) {
            return;
        }
        this.isHovered = true;
        this.onHoverChanged();
    }
    onPointerUp(_e: ex.PointerEvent): void {
    }
    onPointerDown(_e: ex.PointerEvent): void {
    }

    onHoverChanged() {

    }

    getCurrentTick() {
        const engine = this.scene?.engine;
        if (engine == null) {
            return 0;
        }
        return engine.stats.currFrame.id;
    }

    render() {
        const tick = this.getCurrentTick();
        if (this.lastRenderTick == tick) {
            return;
        }
        this.lastRenderTick = tick;
        
        this.onRender();
        for(let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof Panel) {
                child.render();
            }
        }
    }

    onAdd(): void {
        this.render();
    }
    
    onRender() {
    }

    getParent<T = Panel>(): T | null {
        let parent = this.parent;
        if (parent instanceof Panel) {
            return parent as T;
        }
        return null;
    }

    getBounds(): ex.BoundingBox | null {    
        return new ex.BoundingBox(this.pos.x, this.pos.y, this.width, this.height);
    }

    getParentBounds(): ex.BoundingBox | null {
        let parent = this.getParent();
        if (parent != null) {
            return parent.getBounds();
        }

        return this.scene?.camera?.viewport ?? null;
    }

}