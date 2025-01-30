import { Building } from "@src/building";
import { Config } from "@src/config";
import { ease } from "@src/easing";
import { Resources } from "@src/resources";
import { Serializable } from "@src/systems/save-system";
import { random } from "@src/utility/random";
import * as ex from "excalibur";

const possibleRolls: { [key: number]: number[][] } = {};
const totalPossibleRolls = 100;

function getNewRoll(faces: number[], lastNumber: number): number {
  const tempFaces = [...faces].filter((f) => f != lastNumber);
  if (faces.length === 0) {
    return -1;
  }
  return random.fromArray(tempFaces);
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

  let rollsPerItem = Math.floor(totalPossibleRolls / faces);
  for (let face = 1; face <= faces; face++) {
    for (let i = 0; i < rollsPerItem; i++) {
      const roll = [];
      const totalRolls = Math.floor(Math.random() * 5 + 10);
      for (let i = 0; i < totalRolls; i++) {
        const newNumber = getNewRoll(diceFaces, random.integer(1, faces));
        roll.push(newNumber);
      }
      roll[roll.length - 2] = getNewRoll(diceFaces, roll[roll.length - 1]);
      roll[roll.length - 1] = face;

      possibleRolls[faces].push(roll);
    }
  }
  const rollsPerNumber: any = {};
  const rolles = possibleRolls[faces];

  for (let i = 0; i < rolles.length; i++) {
    const roll = rolles[i];
    const lastNumber = roll[roll.length - 1];
    rollsPerNumber[lastNumber] = (rollsPerNumber[lastNumber] ?? 0) + 1;
  }
  return possibleRolls[faces];
}

function getRandomRoll(faces: number, face?: number): number[] {
  const diceFaces = getPossibleRolls(faces);
  if (face == undefined) {
    return random.fromArray(diceFaces);
  }
  let rolles = diceFaces.filter((r) => r[r.length - 1] == face);
  return random.fromArray(rolles);
}

const possibleRollAnimations: {
  [key: string]: Record<
    number,
    { animation: ex.Animation; numbers: number[] }[]
  >;
} = {};

const rollAnimationsPerFace = 10;

function getPossibleRollAnimations(faces: number, speed: number) {
  speed = speed ?? 1;
  const key = `${faces}-${speed}`;
  if (faces in possibleRollAnimations) {
    return possibleRollAnimations[key];
  }
  possibleRollAnimations[key] = {};

  for (let face = 1; face <= faces; face++) {
    for (
      let rollAnimationIndex = 0;
      rollAnimationIndex < rollAnimationsPerFace;
      rollAnimationIndex++
    ) {
      const sprites = diceResources.map((r) => {
        const sprite = ex.Sprite.from(r);
        sprite.width = 16;
        sprite.height = 16;
        return sprite;
      });

      const diceNumbers = getRandomRoll(faces, face);
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
      if (possibleRollAnimations[key][face] == null) {
        possibleRollAnimations[key][face] = [];
      }
      possibleRollAnimations[key][face].push({
        animation: animation,
        numbers: diceNumbers,
      });
    }
  }
  return possibleRollAnimations[key];
}

function getRandomRollAnimation(
  faces: number,
  speed: number,
  weight: number
): {
  animation: ex.Animation;
  numbers: number[];
} {
  const diceFaces = getPossibleRollAnimations(faces, speed);
  const numberCount: any = {};
  let randomNumber = Math.min(random.integer(1, 6 + weight), 6);
  const rolls = diceFaces[randomNumber];

  for (const i in rolls) {
    const numbers = rolls[i].numbers;
    const lastNumber = numbers[numbers.length - 1];
    numberCount[lastNumber] = (numberCount[lastNumber] ?? 0) + 1;
  }
  return random.fromArray(rolls);
}

export class Dice extends Building implements Serializable {
  static serializeName: string = "Dice";
  friendlyName: string = "Dice";
  rolling: boolean = false;
  private _faces: number = 6;
  private _speed: number = 1;
  private _value: number = 0;
  private _multiplier: number = 1;

  private _weight: number = -1;
  get weight(): number {
    return this._weight;
  }
  set weight(value: number) {
    this._weight = value;
  }

  get tooltip() {
    let str = `Click to roll`;
    if (this.multiplier != 1) {
      str += `\nx${this.multiplier} Multi`;
    }
    return str;
  }

  get multiplier(): number {
    return this._multiplier;
  }
  set multiplier(value: number) {
    this._multiplier = Math.round(value * 10) / 10;
    const clampedValue = Math.min(10, Math.max(0, value));
    const yellowIntensity = Math.floor((clampedValue / 10) * 255);
    this.color = ex.Color.fromRGB(255, 255, 255 - yellowIntensity);
  }

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

  get rollSpeed(): number {
    return this._speed;
  }

  set rollSpeed(value: number) {
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
  onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.player.unlockAction("NEWROLLER");
  }
  serialize() {
    return {
      faces: this.faces,
      speed: this.rollSpeed,
      value: this.value,
      pos: this.pos,
    };
  }
  deserialize(data: any): void {
    this.rollSpeed = data.rollSpeed;
    this.faces = data.faces;
    this.value = data.value;
    this.pos = ex.vec(data.pos._x, data.pos._y);
  }

  postDeserialize(): void {
    try {
      let rollAnimation = getRandomRollAnimation(
        this.faces,
        this.rollSpeed,
        this.weight
      );
      const lastFrame =
        rollAnimation.animation.frames[
          rollAnimation.animation.frames.length - 1
        ]?.graphic;

      if (lastFrame == null) {
        return;
      }

      this.graphics.add("roll", lastFrame);
      this.graphics.use("roll");
    } catch (e) {
      console.error(e);
    }
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
    if (this.rollSpeed <= 0) {
      return;
    }
    if (this.weight == -1) {
      this.weight = this.player.getUpgrade("DiceWeight")?.value ?? 0;
    }
    this.rolling = true;
    const speed = this.rollSpeed;
    const faces = this.faces;
    const roll = getRandomRollAnimation(faces, speed, this.weight);
    console.log(this.weight);
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
      if (animation.currentFrame?.graphic != null) {
        this.graphics.add("roll", animation.currentFrame?.graphic);
        this.graphics.use("roll");
      }
    });
  }

  onRollFinish() {
    this.rolling = false;
    let score = this.player.getUpgrade("BetterDice")?.value ?? 0;
    let totalScore = Math.floor(this.value * this.multiplier) + score;
    this.multiplier = 1;
    this.player.scoreComponent.createScore(this, totalScore);
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
