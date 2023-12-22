import { GenericDay } from "~/utils/day.ts";

class Present {
  public constructor(
    public length: number,
    public width: number,
    public height: number,
  ) {}

  public neededWrappingPaper() {
    const lw = this.length * this.width;
    const wh = this.width * this.height;
    const hl = this.height * this.length;

    const smallestSide = Math.min(lw, wh, hl);

    return 2 * lw + 2 * wh + 2 * hl + smallestSide;
  }

  public neededRibbon() {
    const sorted = [this.length, this.width, this.height]
      .sort((a, b) => a - b);

    const smallest = sorted.at(0)!;
    const secondSmallest = sorted.at(1)!;

    const ribbonForBox = 2 * smallest + 2 * secondSmallest;
    const ribbonForBow = this.length * this.width * this.height;

    return ribbonForBox + ribbonForBow;
  }

  public static fromRaw(raw: string) {
    const dataRaw = raw.split('x');

    const lengthRaw = dataRaw[0];
    const widthRaw = dataRaw[1];
    const heightRaw = dataRaw[2];

    const length = parseInt(lengthRaw);
    const width = parseInt(widthRaw);
    const height = parseInt(heightRaw);

    return new Present(length, width, height);
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    const rawPresents = input.split('\n');
    const presents = rawPresents.map((raw) => Present.fromRaw(raw));
    return presents;
  }

  public partOne(presents: ReturnType<this["parse"]>): number {
    return presents.reduce((total, present) => {
      return total + present.neededWrappingPaper();
    }, 0);
  }

  public partTwo(presents: ReturnType<this["parse"]>): number {
    return presents.reduce((total, present) => {
      return total + present.neededRibbon();
    }, 0);
  }
}
