import * as ex from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources";
import { ease } from "../easing";
import { random } from "../utility/random";
import { Building } from "../building";
import { Level } from "../level";

const possibleRolls: { [key: number]: number[][] } = {};
const totalPossibleRolls = 100;

function getNewRoll(faces: number[], lastNumber: number): number {
  const tempFaces = [...faces].filter((f) => f != lastNumber);
  if (faces.length === 0) {
    return -1;
  }
  return random.array(tempFaces);
}

export const diceResources = [
  Resources.DiceEmpty,
  Resources.Dice1,
  Resources.Dice2,
  Resources.Dice3,
  Resources.Dice4,
  Resources.Dice5,
  Resources.Dice6,
];

function getPossibleRolls(faces: number): number[][] {
  if (faces in possibleRolls) {
    return possibleRolls[faces];
  }
  possibleRolls[faces] = [];

  let diceFaces = [];
  for (let i = 0; i < faces; i++) {
    diceFaces.push(i + 1);
  }

  for (let i = 0; i < totalPossibleRolls; i++) {
    const roll = [];
    const totalRolls = Math.floor(Math.random() * 5 + 10);
    for (let i = 0; i < totalRolls; i++) {
      const newNumber = getNewRoll(diceFaces, roll[roll.length - 1]);
      roll.push(newNumber);
    }

    possibleRolls[faces].push(roll);
  }
  return possibleRolls[faces];
}

function getRandomRoll(faces: number): number[] {
  const diceFaces = getPossibleRolls(faces);
  return diceFaces[Math.floor(Math.random() * diceFaces.length)];
}

const possibleRollAnimations: {
  [key: string]: { animation: ex.Animation; numbers: number[] }[];
} = {};

function getPossibleRollAnimations(faces: number, speed: number) {
  const key = `${faces}-${speed}`;
  if (faces in possibleRollAnimations) {
    return possibleRollAnimations[key];
  }
  possibleRollAnimations[key] = [];

  const rollAnimationsPerFace = 10;

  for (let i = 0; i < faces * rollAnimationsPerFace; i++) {
    const sprites = diceResources.map((r) => {
      const sprite = ex.Sprite.from(r);
      sprite.width = 16;
      sprite.height = 16;
      return sprite;
    });

    const diceNumbers = getRandomRoll(faces);
    const frameData: {
      number: number;
      duration: number;
    }[] = [];

    const rollDuration = 100;

    for (const i in diceNumbers) {
      const newNumber = diceNumbers[i];
      const percentage = parseInt(i) / diceNumbers.length;
      const duration =
        ease("diceRollEasing", percentage, diceNumbers.length) * rollDuration;

      frameData.push({
        number: newNumber,
        duration: duration,
      });
    }

    const animation = new ex.Animation({
      frames: frameData.map((item) => {
        return {
          graphic: sprites[item.number],
          duration: item.duration,
        };
      }),
      speed: 1,
      strategy: ex.AnimationStrategy.Freeze,
    });
    possibleRollAnimations[key].push({
      animation: animation,
      numbers: diceNumbers,
    });
  }
  return possibleRollAnimations[key];
}

function getRandomRollAnimation(
  faces: number,
  speed: number
): {
  animation: ex.Animation;
  numbers: number[];
} {
  const diceFaces = getPossibleRollAnimations(faces, speed);
  return random.array(diceFaces);
}

export class Dice extends Building {
  getLevel(): Level {
    if (this.scene == null) {
      throw new Error("Scene is null");
    }
    if (!(this.scene instanceof Level)) {
      throw new Error("Scene is not a Level");
    }
    return this.scene;
  }

  rolling: boolean = false;
  faces: number = 6;
  speed: number = 1;
  value: number = 0;
  constructor(faces: number = 6, speed: number = 1) {
    super();
    this.setFaces(faces);
    this.speed = speed;
    this.spriteImage = Resources.DiceEmpty;
  }

  setFaces(faces: number) {
    if (faces <= 1) {
      throw new Error("Faces must be greater than 1");
    }
    this.faces = Math.floor(faces);
  }

  onTrigger() {
    this.rollDice();
  }

  onBuild(): void {
    this.rollDice();
  }

  rollDice() {
    if (this.rolling) {
      return;
    }
    if (this.faces <= 1) {
      return;
    }
    if (this.speed <= 0) {
      return;
    }
    this.rolling = true;
    const speed = this.speed;
    const faces = this.faces;
    const roll = getRandomRollAnimation(faces, speed);
    const animation = roll.animation;
    this.value = roll.numbers[roll.numbers.length - 1];

    this.graphics.add("roll", animation, {});
    this.graphics.use("roll");
    animation.events.on("end", () => {
      this.onRollFinish();
    });
  }

  onRollFinish() {
    this.rolling = false;
    const level = this.getLevel();
    level.player.scoreComponent.createScore(this, this.value);
  }

  start() {
    this.pos = Config.BirdStartPos; // starting position
    this.acc = ex.vec(0, Config.BirdAcceleration); // pixels per second per second
  }

  reset() {
    this.pos = Config.BirdStartPos; // starting position
    this.stop();
  }

  stop() {
    this.vel = ex.vec(0, 0);
    this.acc = ex.vec(0, 0);
  }
}
