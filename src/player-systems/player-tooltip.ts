import { Label } from "../ui/elements/label";

export type Tooltip = {
    code: string;
    title: string;
    description: string;
}

export class PlayerTooltip extends Label {
    _tooltip: Tooltip | null = null;

    get tooltip(): Tooltip | null {
        return this._tooltip;
    }
    set tooltip(value: Tooltip | null) {
        if (value == null) {
            this.visible = false;
            return;
        } else {
            this.visible = true;
        }
        this._tooltip = value;
        this.text = `${value.title}\n${value.description}`;
        this.dirty = true;
    }
}