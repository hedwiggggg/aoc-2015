import { GenericDay } from "~/utils/day.ts";
import { Vector2 } from "~/utils/math.ts";

interface Light {
  state: number;

  toggle(): void;
  turnOn(): void;
  turnOff(): void;
}

class SimpleLight implements Light {
  public constructor(
    public state: number = 0,
  ) {}

  public toggle() {
    this.state = this.state === 0 ? 1 : 0;
  }

  public turnOn() {
    this.state = 1;
  }

  public turnOff() {
    this.state = 0;
  }
}

class DimmableLight implements Light {
  public constructor(
    public state: number,
  ) {}

  public toggle() {
    this.state += 2;
  }

  public turnOn() {
    this.state += 1;
  }

  public turnOff() {
    this.state = Math.max(0, this.state - 1);
  }
}

class Instruction {
  public constructor(
    public type: 'toggle' | 'turn on' | 'turn off',
    public from: Vector2,
    public to: Vector2,
  ) {}

  public apply(house: House) {
    for (let x = this.from.x; x <= this.to.x; x++) {
      for (let y = this.from.y; y <= this.to.y; y++) {
        const light = house.get(x, y);

        switch (this.type) {
          case 'toggle':
            light.toggle();
            break;

          case 'turn on':
            light.turnOn();
            break;

          case 'turn off':
            light.turnOff();
            break;
        }
      }
    }
  }

  public static fromRaw(raw: string) {
    const regex = /^(toggle|turn on|turn off) (\d+),(\d+) through (\d+),(\d+)$/;
    const match = raw.match(regex);

    if (!match) {
      throw new Error(`Invalid instruction: ${raw}`);
    }

    const [, type, fromX, fromY, toX, toY] = match;

    return new Instruction(
      type as Instruction['type'],
      new Vector2(parseInt(fromX), parseInt(fromY)),
      new Vector2(parseInt(toX), parseInt(toY)),
    );
  }
}

class House {
  public constructor(
    public instructions: Instruction[],
    public lights: Light[][] = Array.from(
      { length: 1000 },
      () => Array.from(
        { length: 1000 },
        () => new SimpleLight()
      ),
    ),
  ) {}

  public processInstructions() {
    this.instructions.forEach((instruction) => {
      instruction.apply(this);
    });

    return this;
  }

  public upgradeLights() {
    this.lights = this.lights.map((row) => row.map((light) => {
      return new DimmableLight(light.state);
    }));

    return this;
  }

  public get(x: number, y: number) {
    return this.lights[y][x];
  }

  public static fromRaw(raw: string) {
    const instructions = raw
      .split('\n')
      .map((raw) => Instruction.fromRaw(raw));

    return new House(instructions);
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    return House.fromRaw(input);
  }

  public partOne(house: ReturnType<this["parse"]>): number {
    return house
      .processInstructions()
      .lights
      .flat()
      .filter((light) => light.state)
      .length;
  }

  public partTwo(house: ReturnType<this["parse"]>): number {
    return house
      .upgradeLights()
      .processInstructions()
      .lights
      .flat()
      .reduce((acc, light) => acc + light.state, 0);
  }
}
