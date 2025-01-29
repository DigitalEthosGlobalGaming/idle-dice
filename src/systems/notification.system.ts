import * as ex from "excalibur";

export type NotificationType = "info" | "warning" | "error" | "success";
export type NotificationArgs = {
  title?: string;
  message?: string;
  type: NotificationType;
  canDismiss?: boolean;
  duration?: number;
} & ({ title: string } | { message: string });

export class Notification {
  public id = NotificationSystem.NotificationId;
  public message: string;
  public title: string;
  public type: NotificationType;
  public duration: number;
  public createdAt: number;
  public dismissed = false;
  public expired = false;
  public priority = 0;
  public get percentageComplete() {
    if (this.duration <= 0) {
      return 0;
    }
    return Math.min(1, (new Date().getTime() - this.createdAt) / this.duration);
  }

  constructor(args: NotificationArgs) {
    this.title = args.title ?? "";
    this.message = args.message ?? "";
    this.type = args.type;
    this.duration = args.duration ?? -1;
    this.createdAt = new Date().getTime();
  }
}

export class NotificationSystem extends ex.System {
  private _tickRate = 500;
  private _lastTick = 0;
  static _NotificationId: number = 0;
  public static get NotificationId() {
    return NotificationSystem._NotificationId++;
  }
  public systemType = ex.SystemType.Update;
  protected _notifications: Notification[] = [];
  get notifications() {
    return this._notifications.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.createdAt - b.createdAt;
      }
      return a.priority - b.priority;
    });
  }

  public add(args: NotificationArgs | string) {
    if (typeof args === "string") {
      args = { message: args, type: "info" };
    }

    const notification = new Notification(args);
    this.notifications.push(notification);
  }

  public remove(index: number | Notification) {
    if (typeof index === "number") {
      this.notifications.splice(index, 1);
    } else {
      const idx = this.notifications.indexOf(index);
      if (idx >= 0) {
        this.notifications.splice(idx, 1);
      }
    }
  }

  public update(delta: number) {
    this._lastTick += delta;
    if (this._lastTick >= this._tickRate) {
      this.onTick();
      this._lastTick = 0;
    }
  }

  public onTick() {
    // Implement the logic to be executed on each tick
  }
}
