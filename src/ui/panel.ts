import * as ex from "excalibur";
import {
  ButtonStates,
  ExtendedPointerEvent,
  InputHandler,
  InputManager,
} from "../input-manager";
import { Resources } from "../resources";

export class PanelBackground extends ex.Actor {
  private nineSlice!: ex.NineSlice;
  constructor(parent: Panel) {
    super({
      width: parent.size.x,
      height: parent.size.y,
    });
    this.z = -1;

    this.resize(parent.size.x, parent.size.y);
  }
  resize(width: number, height: number) {
    const myNineSliceConfig: ex.NineSliceConfig = {
      width: width,
      height: height,
      source: Resources.UiButtonSquareFlat,
      sourceConfig: {
        width: 64,
        height: 64,
        topMargin: 8,
        leftMargin: 8,
        bottomMargin: 8,
        rightMargin: 8,
      },
      destinationConfig: {
        drawCenter: true,
        horizontalStretch: ex.NineSliceStretch.TileFit,
        verticalStretch: ex.NineSliceStretch.TileFit,
      },
    };
    this.nineSlice = new ex.NineSlice(myNineSliceConfig);

    this.graphics.use(this.nineSlice);
  }
}

export class Panel extends ex.Actor implements InputHandler {
  lastRenderTick = -1;
  isHovered = false;
  isMouseDown = false;
  _size: ex.Vector | null = null;
  needsRender = true;
  dirty = true;
  get size(): ex.Vector {
    return this._size ?? new ex.Vector(this.width, this.height);
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
      if (this.hasBackground) {
        this._background?.resize(value.x, value.y);
      }
    } else {
      this._background?.kill();
    }
    this.dirty = true;
  }
  _globalBounds: ex.BoundingBox | null = null;
  acceptingInputs?: boolean | ButtonStates[];

  _background: PanelBackground | null = null;
  get hasBackground(): boolean {
    return this._background != null;
  }

  set backgroundColor(color: ex.Color | null) {
    if (this._background?.graphics?.current != null) {
      this._background.graphics.current.tint = color ?? ex.Color.White;
    }
  }

  set hasBackground(value: boolean) {
    if (value) {
      if (this._background == null) {
        this._background = new PanelBackground(this);
        this.addChild(this._background);
      }
    } else {
      if (this._background != null) {
        this._background.kill();
        this._background = null;
      }
    }
  }

  margin: ex.Vector = ex.vec(0, 0);
  padding: ex.Vector = ex.vec(0, 0);

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

  constructor(parent?: Panel) {
    super();
    if (parent != null) {
      parent.addChild(this);
    }
  }

  collides(vec: ex.Vector): boolean {
    if (this.acceptingInputs === false) {
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

  onPointerLeave(_e: ExtendedPointerEvent): void {
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
  onPointerUp(_e: ex.PointerEvent): void {}
  onPointerDown(_e: ex.PointerEvent): void {}

  onHoverChanged() {}

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
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child instanceof Panel) {
        child.render();
      }
    }
  }

  onAdd(engine: ex.Engine): void {
    super.onAdd(engine);
    InputManager.register(this);
  }

  onRender() {}

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
}
