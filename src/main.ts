import * as ex from 'excalibur';
import { Level } from './level';
import { GameLoader } from './game-loader';

const game = new ex.Engine({
  backgroundColor: ex.Color.fromHex("#222222"),
  pixelArt: false,
  displayMode: ex.DisplayMode.Fixed,
  scenes: { Level }
});

const loader = new GameLoader();

game.start(loader).then(() => {
  game.goToScene('Level');
});