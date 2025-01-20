import * as ex from "excalibur";
import { Building } from "../building";
import { BetterDiceUpgrade } from "../components/upgrades/better-dice.upgrade";
import { Config } from "../config";
import { ease } from "../easing";
import { Resources } from "../resources";
import { Serializable } from "../systems/save-system";
import { random } from "../utility/random";

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
        const graphic = sprites[item.number];
        return {
          graphic: graphic,
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

export class Dice extends Building implements Serializable {
  rolling: boolean = false;
  private _faces: number = 6;
  private _speed: number = 1;
  private _value: number = 0;

  get faces(): number {
    return this._faces;
  }

  set faces(value: number) {
    if (value <= 1) {
      throw new Error("Faces must be greater than 1");
    }
    value = Math.floor(value);
    if (value == this._faces) {
      return;
    }
    this._faces = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    if (value <= 0) {
      throw new Error("Speed must be greater than 0");
    }
    this._speed = value;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }
  serialize() {
    return {
      faces: this.faces,
      speed: this.speed,
      value: this.value,
      pos: this.pos,
    };
  }
  deserialize(data: any): void {
    this.speed = data.speed;
    this.faces = data.faces;
    this.value = data.value;
    this.pos = ex.vec(data.pos._x, data.pos._y);
  }

  postDeserialize(): void {
    let rollAnimation = getRandomRollAnimation(this.faces, this.speed);
    const lastFrame = rollAnimation.animation.frames[rollAnimation.animation.frames.length - 1]?.graphic;
    if (lastFrame == null) {
      return;
    }

    this.graphics.add("roll", lastFrame);
    this.graphics.use("roll");
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
    let originalPosition = this.pos.clone();
    animation.events.on("frame", (frame) => {
      if (frame.frameIndex < roll.numbers.length) {
        const offset = random.integer(2, 4);
        this.pos = ex.vec(
          random.number(-offset, offset),
          random.number(-offset, offset)
        );
      } else {
        this.pos = ex.vec(0, 0);
      }
    });
    animation.events.on("end", () => {
      this.pos = originalPosition;
      this.onRollFinish();
    });
  }

  onRollFinish() {
    this.rolling = false;
    const score = this.player.getUpgrade(BetterDiceUpgrade)?.value ?? 0;
    this.player.scoreComponent.createScore(this, this.value + score);
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
