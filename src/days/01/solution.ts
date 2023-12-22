import { GenericDay } from "~/utils/day.ts";

enum Instruction {
  Up = "(",
  Down = ")",
}

class Santa {
  public constructor(
    public floor = 0,
    public instructions: Instruction[] = [],
  ) {}

  public getEndFloor() {
    return this.instructions.reduce(
      (floor, instruction) =>
        floor + (instruction === Instruction.Up ? 1 : -1),
      this.floor,
    );
  }

  public getTargetFloor(target: number) {
    let floor = this.floor;

    for (let i = 0; i < this.instructions.length; i++) {
      const instruction = this.instructions[i];
      floor += instruction === Instruction.Up ? 1 : -1;
      if (floor === target) return i + 1;
    }

    throw new Error("Target floor not reached");
  }

  public static fromRaw(raw: string) {
    const instructions = raw
      .split("")
      .map((char) => char as Instruction);

    return new Santa(0, instructions);
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    return Santa.fromRaw(input);
  }

  public partOne(santa: ReturnType<this["parse"]>): number {
    return santa.getEndFloor();
  }

  public partTwo(input: ReturnType<this["parse"]>): number {
    return input.getTargetFloor(-1);
  }
}
