import { Graphic, Vector, Color, BoundingBox, ExcaliburGraphicsContext } from 'excalibur'; // Adjust imports as necessary

interface GridOptions {
    rows: number;
    columns: number;
    cellWidth: number;
    cellHeight: number;
    color: Color;
    thickness: number;
}

export class Grid extends Graphic {
    readonly rows: number;
    readonly columns: number;
    readonly cellWidth: number;
    readonly cellHeight: number;
    color: Color;
    thickness: number;
    private _localBounds!: BoundingBox;

    constructor(options: GridOptions) {
        super();
        this.rows = options.rows;
        this.columns = options.columns;
        this.cellWidth = options.cellWidth;
        this.cellHeight = options.cellHeight;
        this.color = options.color;
        this.thickness = options.thickness;
        this._calculateBounds();
    }

    get localBounds(): BoundingBox {
        return this._localBounds;
    }

    private _calculateBounds(): void {
        this._localBounds = new BoundingBox(
            0,
            0,
            this.columns * this.cellWidth,
            this.rows * this.cellHeight
        );
    }

    protected _drawImage(ctx: ExcaliburGraphicsContext, _x: number, _y: number): void {
        for (let row = 0; row <= this.rows; row++) {
            const y = row * this.cellHeight;
            ctx.drawLine(
                new Vector(0, y),
                new Vector(this.columns * this.cellWidth, y),
                this.color,
                this.thickness
            );
        }

        for (let col = 0; col <= this.columns; col++) {
            const x = col * this.cellWidth;
            ctx.drawLine(
                new Vector(x, 0),
                new Vector(x, this.rows * this.cellHeight),
                this.color,
                this.thickness
            );
        }
    }

    clone(): Grid {
        return new Grid({
            rows: this.rows,
            columns: this.columns,
            cellWidth: this.cellWidth,
            cellHeight: this.cellHeight,
            color: this.color,
            thickness: this.thickness
        });
    }
}
