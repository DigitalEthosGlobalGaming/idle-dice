import * as ex from "excalibur";
import { Level } from "./level";
import { GameLoader } from "./game-loader";

const game = new ex.Engine({
  backgroundColor: ex.Color.fromHex("#000000"),
  pixelArt: false,
  displayMode: ex.DisplayMode.FillScreen,
  scenes: { Level },
});

const loader = new GameLoader();

game.start(loader).then(() => {
  game.goToScene("Level");
});
