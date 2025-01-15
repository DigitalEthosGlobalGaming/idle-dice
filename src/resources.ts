import * as ex from "excalibur";

export const Resources = {
    // Relative to /public in vite

    Token: new ex.ImageSource("./images/board-game-icons/token.png"),
    Tokens: new ex.ImageSource("./images/board-game-icons/token.png"),
    TokensStack: new ex.ImageSource("./images/board-game-icons/tokens_stack.png"),
    DiceEmpty: new ex.ImageSource("./images/board-game-icons/dice_empty.png"),
    Dollar: new ex.ImageSource("./images/board-game-icons/dollar.png"),
    Dice1: new ex.ImageSource("./images/board-game-icons/dice_1.png"),
    Dice2: new ex.ImageSource("./images/board-game-icons/dice_2.png"),
    Dice3: new ex.ImageSource("./images/board-game-icons/dice_3.png"),
    Dice4: new ex.ImageSource("./images/board-game-icons/dice_4.png"),
    Dice5: new ex.ImageSource("./images/board-game-icons/dice_5.png"),
    Dice6: new ex.ImageSource("./images/board-game-icons/dice_6.png"),
    HandCube: new ex.ImageSource("./images/board-game-icons/hand_cube.png"),
    DiceOut: new ex.ImageSource("./images/board-game-icons/dice_out.png"),
    Pouch: new ex.ImageSource("./images/board-game-icons/pouch.png"),
    ChessQueen: new ex.ImageSource("./images/board-game-icons/chess_queen.png"),
    SuitDiamonds: new ex.ImageSource("./images/board-game-icons/suit_diamonds.png"),
    SuitHearts: new ex.ImageSource("./images/board-game-icons/suit_hearts.png"),
    SuitSpades: new ex.ImageSource("./images/board-game-icons/suit_spades.png"),
    SuitClubs: new ex.ImageSource("./images/board-game-icons/suit_clubs.png"),
    DiceSkull: new ex.ImageSource("./images/board-game-icons/dice_skull.png"),

    // Sounds
    FlapSound: new ex.Sound("./sounds/flap.wav"),
    FailSound: new ex.Sound("./sounds/fail.wav"),
    ScoreSound: new ex.Sound("./sounds/score.wav"),

    // UI Images
    UiButtonSquareFlat: new ex.ImageSource("./images/ui/button_square_flat.png"),
    UiFrame: new ex.ImageSource("./images/ui/button_square_flat.png"),
} as const;

const UiNineSlices = {
    ButtonSquareFlat: {
        source: Resources.UiButtonSquareFlat,
        sourceConfig: {
            width: 105,
            height: 21,
            topMargin: 8,
            leftMargin: 8,
            bottomMargin: 8,
            rightMargin: 8,
        },
    }
}

export type NinesliceResourceOptions = {
    name: keyof typeof UiNineSlices;
    height: number;
    width: number;
    drawCenter?: boolean;
    horizontalStretch?: ex.NineSliceStretch;
    verticalStretch?: ex.NineSliceStretch;
}

export function getNineslice(config: NinesliceResourceOptions) {
    const { source, sourceConfig } = UiNineSlices[config.name];
    const nineSliceConfig = {
        sourceConfig: sourceConfig,
        source: source,
        width: config.width,
        height: config.height,
        destinationConfig: {
            drawCenter: config.drawCenter ?? true,
            horizontalStretch: config.horizontalStretch ?? ex.NineSliceStretch.Stretch,
            verticalStretch: config.verticalStretch ?? ex.NineSliceStretch.Stretch,
        }
    };

    return new ex.NineSlice(nineSliceConfig);
}

