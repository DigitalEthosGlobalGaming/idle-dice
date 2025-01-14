import * as ex from "excalibur";
import {
  ButtonStates,
  ExtendedPointerEvent,
  InputHandler,
  InputManager,
} from "../input-manager";

export class Panel extends ex.Actor implements InputHandler {
  lastRenderTick = -1;
  isHovered = false;
  isMouseDown = false;
  size: ex.Vector | null = null;
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
    PanelClass: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof PanelClass>
  ): T {
    let element = new PanelClass(this, ...args);

    if (element.parent == null) {
      this.addChild(element);
    }
    this.render();
    return element;
  }

  onInitialize(): void {
    this.render();
  }

  // attachEvents() {
  //   this.on("pointerup", (e) => {
  //     this.onPointerUp(e);
  //   });
  //   this.on("pointerdown", (e) => {
  //     this.onPointerDown(e);
  //   });
  //   this.on("pointerenter", (e) => {
  //     this.onPointerEnter(e);
  //   });
  //   this.on("pointerleave", (e) => {
  //     this.onPointerLeave(e);
  //   });
  // }

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
    this.render();
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
}
