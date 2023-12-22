import { GenericDay } from "~/utils/day.ts";

export class Day extends GenericDay {
  public parse(input: string) {
    throw new Error("Method not implemented.");
  }

  public partOne(input: ReturnType<this["parse"]>): number {
    throw new Error("Method not implemented.");
  }

  public partTwo(input: ReturnType<this["parse"]>): number {
    throw new Error("Method not implemented.");
  }
}
