import * as ex from "excalibur";
import { InputHandler, InputManager } from "../input-manager";

export class Panel extends ex.Actor implements InputHandler {
  lastRenderTick = -1;
  isHovered = false;
  isMouseDown = false;
  bounds: ex.BoundingBox | null = null;

  get globalBounds(): ex.BoundingBox | null {
    if (this.bounds == null) {
      return null;
    }
    return new ex.BoundingBox(
      this.globalPos.x,
      this.globalPos.y,
      this.bounds.width,
      this.bounds.height
    );
  }

  constructor(parent?: Panel) {
    super();
    if (parent != null) {
      parent.addChild(this);
    }
  }

  collides(vec: ex.Vector): boolean {
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
    return element;
  }

  onInitialize(): void {
    this.render();
    this.attachEvents();
  }

  attachEvents() {
    this.on("pointerup", (e) => {
      this.onPointerUp(e);
    });
    this.on("pointerdown", (e) => {
      this.onPointerDown(e);
    });
    this.on("pointerenter", (e) => {
      this.onPointerEnter(e);
    });
    this.on("pointerleave", (e) => {
      this.onPointerLeave(e);
    });
  }

  getPanelChildren(): Panel[] {
    return this.children.filter((c) => c instanceof Panel) as Panel[];
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

    this.bounds = this.calculateBounds();
    this.onRender();
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child instanceof Panel) {
        child.render();
      }
    }
  }

  onAdd(): void {
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

  calculateBounds(): ex.BoundingBox | null {
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

  doesCollide(position: ex.Vector) {
    if (this.isInBounds(position)) {
      return true;
    }
    const panelChildren = this.getPanelChildren();
    for (let i = 0; i < panelChildren.length; i++) {
      const child = panelChildren[i];
      if (child.doesCollide(position)) {
        return true;
      }
    }
    return false;
  }
}
