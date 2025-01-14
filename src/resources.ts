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

  // Images
  BirdImage: new ex.ImageSource("./images/bird.png"),
  PipeImage: new ex.ImageSource("./images/pipe.png", {
    wrapping: ex.ImageWrapping.Clamp, // Clamp is the default
  }),
  GroundImage: new ex.ImageSource("./images/ground.png", {
    wrapping: ex.ImageWrapping.Repeat,
  }),

  // Sounds
  FlapSound: new ex.Sound("./sounds/flap.wav"),
  FailSound: new ex.Sound("./sounds/fail.wav"),
  ScoreSound: new ex.Sound("./sounds/score.wav"),

  // Music
  BackgroundMusic: new ex.Sound("./sounds/two_left_socks.ogg"),

  // Fonts
  FontNormal: new ex.ImageSource("./fonts/outline_24x32.png"),
} as const;
