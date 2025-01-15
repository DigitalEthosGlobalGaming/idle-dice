import * as ex from "excalibur";
import {
    ButtonStates,
    ExtendedPointerEvent,
    InputHandler,
    InputManager,
} from "../input-manager";
import { Level } from "../level";
import { Player } from "../player-systems/player";
import { getNineslice } from "../resources";

export enum PanelBackgrounds {
    "ButtonSquareFlat" = "ButtonSquareFlat"
}

export class Panel extends ex.Actor implements InputHandler {
    lastRenderTick = -1;
    isHovered = false;
    isMouseDown = false;
    _size: ex.Vector | null = null;
    needsRender = true;
    dirty = true;


    get level(): Level {
        if (this.scene instanceof Level) {
            return this.scene;
        }
        throw new Error("Scene is not a Level");
    }

    get player(): Player | undefined {
        return this.level.player;
    }

    private graphicsGroup!: ex.GraphicsGroup;


    _visible = true;
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        if (value == this._visible) {
            return;
        }
        this._visible = value;
        this.dirty = true;
    }

    _padding = 0;
    get padding(): number {
        return this._padding;
    }
    set padding(value: number) {
        this._padding = value;
        this.dirty = true;
    }

    get size(): ex.Vector {
        if (this.visible == false) {
            return ex.vec(0, 0);
        }
        let size = this._size ?? new ex.Vector(this.width, this.height);
        if (this.padding) {
            size = size.add(ex.vec(this.padding * 2, this.padding * 2));
        }
        return size;
    }

    set size(value: ex.Vector | null) {
        if (value == null && this._size == null) {
            return;
        }
        if (this._size?.equals(value ?? ex.vec(0, 0))) {
            return;
        }
        this._size = value;
        if (value != null) {
            this.onResize(this.size.x,this.size.y);
        }
        this.dirty = true;
    }

    _backgroundColor: ex.Color | null = null;
    get backgroundColor(): ex.Color | null {
        return this._backgroundColor;
    }
    set backgroundColor(value: ex.Color | null) {
        if (value == this._backgroundColor) {
            return;
        }
        this._backgroundColor = value;
        this.dirty = true;
    }


    _color: ex.Color = ex.Color.White;
    get color(): ex.Color {
        return this.backgroundColor ?? ex.Color.White;
    }
    set color(value: ex.Color) {
        if (value == this._color) {
            return;
        }
        this._color = value;
        this.dirty = true;
    }



    _globalBounds: ex.BoundingBox | null = null;
    acceptingInputs?: boolean | ButtonStates[];

    get bounds(): ex.BoundingBox {
        const width = this.size?.x ?? 0;
        const height = this.size?.y ?? 0;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        return new ex.BoundingBox(
            this.pos.x - halfWidth,
            this.pos.y - halfHeight,
            this.pos.x + halfWidth,
            this.pos.y + halfHeight
        );
    }

    get globalBounds(): ex.BoundingBox | null {
        const width = this.size?.x ?? 0;
        const height = this.size?.y ?? 0;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        return new ex.BoundingBox(
            this.globalPos.x - halfWidth,
            this.globalPos.y - halfHeight,
            this.globalPos.x + halfWidth,
            this.globalPos.y + halfHeight
        );
    }

    _background: PanelBackgrounds | null = null;
    get background(): PanelBackgrounds | null {
        return this._background;
    }
    set background(value: PanelBackgrounds | null) {
        if (value == this._background) {
            return;
        }
        this._background = value;
        this.dirty = true;
    }

    constructor(parent?: Panel) {
        super();
        if (parent != null) {
            parent.addChild(this);
        }

        this.initializeGraphicsGroup();
    }

    initializeGraphicsGroup() {
        if (this.graphicsGroup != null) {
            return;
        }

        this.graphicsGroup = new ex.GraphicsGroup({
            useAnchor: false,
            members: [
            ],
        });
        this.graphics.use(this.graphicsGroup);
    }

    addGraphic(graphic: ex.Graphic, offset?: ex.Vector) {
        offset = offset ?? ex.vec(-this.size.x / 2 + this.padding, -this.size.y / 2 + this.padding);
        this.graphicsGroup.members.push({ graphic, offset });
    }

    collides(vec: ex.Vector): boolean {
        if (this.acceptingInputs === false) {
            return false;
        }

        if (this.visible) {
            return false;
        }

        const bounds = this.globalBounds;
        if (bounds == null) {
            return false;
        }
        return bounds.contains(vec);
    }

    addPanel<T extends Panel>(
        name: string,
        PanelClass: new (...args: any[]) => T,
        ...args: ConstructorParameters<typeof PanelClass>
    ): T {
        let existingChild = this.children.find(
            (c) => c instanceof Panel && c.name == name
        );

        if (existingChild != null) {
            return existingChild as T;
        }

        let element = new PanelClass(this, ...args);
        element.name = name;

        if (element.parent == null) {
            this.addChild(element);
        }
        this.dirty = true;
        return element;
    }

    getPanelChildren(): Panel[] {
        return this.children.filter((c) => c instanceof Panel) as Panel[];
    }

    onPointerLeave(e: ExtendedPointerEvent): void {
        if (!this.isHovered) {
            return;
        }
        this.isHovered = false;
        this.onHoverChanged(e);
    }

    onPointerEnter(e: ex.PointerEvent): void {
        if (this.isHovered) {
            return;
        }
        this.isHovered = true;
        this.onHoverChanged(e);
    }
    onPointerUp(_e: ex.PointerEvent): void { }
    onPointerDown(_e: ex.PointerEvent): void { }

    onHoverChanged(_e: ex.PointerEvent) { }

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
        if (this._background != null) {
            const first: any = this.graphicsGroup.members?.[0];
            if (first == null) {
                const members = [{
                    graphic: getNineslice({
                        name: this._background,
                        width: this.size.x,
                        height: this.size.y,
                    }),
                    offset: ex.vec(-this.size.x / 2, -this.size.y / 2),
                }, ...(this.graphicsGroup.members ?? [])];
                this.graphicsGroup.members = members;
                this.graphics.use(this.graphicsGroup);
            }

            if (first?.graphic instanceof ex.NineSlice) {
                first.graphic.tint = this.backgroundColor ?? ex.Color.White;
            }
        }

        this.onRender();
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof Panel) {
                child.render();
            }
        }

        if (this.visible === false) {
            this.graphics.opacity = 0;
        } else {
            this.graphics.opacity = 1;
        }

        let isFirst = true;

        for (const index in this.graphicsGroup.members) {
            let graphic = (this.graphicsGroup.members[index] as any).graphic;
            if (graphic == null) {
                continue;
            }
            if (this.background != null && isFirst) {
                graphic.tint = this.backgroundColor ?? ex.Color.White;
            } else {
                graphic.tint = this._color;
            }
            isFirst = false;
        }
    }

    onAdd(engine: ex.Engine): void {
        super.onAdd(engine);
        InputManager.register(this);
    }

    onRender() { }

    getParent<T = Panel>(): T | null {
        let parent = this.parent;
        if (parent instanceof Panel) {
            return parent as T;
        }
        return null;
    }

    getParentBounds(): ex.BoundingBox | null {
        let parent = this.getParent();
        if (parent != null) {
            return parent.bounds;
        }

        return this.scene?.camera?.viewport ?? null;
    }

    isInBounds(position: ex.Vector) {
        const bounds = this.globalBounds;
        if (bounds == null) {
            return false;
        }
        return bounds.contains(position);
    }

    override onPreUpdate(engine: ex.Engine, elapsed: number): void {
        super.onPreUpdate(engine, elapsed);
        if (this.dirty) {
            this.dirty = false;
            this.render();
        }
    }

    onResize(_width: number, _height: number) {

    }
}
