import * as ex from "excalibur";
import { Resources } from "../../resources";

let spriteFont: ex.SpriteFont | null = null;

class SpriteFont extends ex.SpriteFont {
    characterWidth: number = 24;
    characterHeight: number = 32;

    constructor(options: {alphabet: string, caseInsensitive: boolean, imageSource: ex.ImageSource ,characterWidth: number, characterHeight: number, characterRows: number, characterColumns: number}) {
        const spriteFontSheet = ex.SpriteSheet.fromImageSource({
            image: Resources.FontNormal,
            grid: {
                rows: 1,
                columns: 1,
                spriteWidth: options.characterWidth,
                spriteHeight: options.characterHeight
            }
        });
        
        super({
            alphabet: `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_\`abcdefghijklmnopqrstuvwxyz`,
            caseInsensitive: true,
            spriteSheet: spriteFontSheet
        });
        this.characterHeight = options.characterHeight ?? 32;
        this.characterWidth = options.characterWidth ?? 24;
    }

    getSize(text: string) {
        return {
            width: text.length * this.characterWidth,
            height: this.characterHeight
        }
    }
}

function getSpriteFont() {
    if (spriteFont != null) {
        return spriteFont;
    }

    spriteFont = new SpriteFont({
        alphabet: `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_\`abcdefghijklmnopqrstuvwxyz`,
        caseInsensitive: true,
        imageSource: Resources.FontNormal,
        characterColumns: 1,
        characterRows: 1,
        characterHeight: 24,
        characterWidth: 32
    });
    return spriteFont;
}

export class Label extends ex.Label {
    constructor(text: string) {
        super({
            text: text,
        });
    }
}