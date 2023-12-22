import { GenericDay } from "~/utils/day.ts";
import { Md5 } from "https://deno.land/std@0.119.0/hash/md5.ts";

class Miner {
  public constructor(
    public secret: string,
  ) {}

  public mine(startingPattern: string) {
    let index = 0;
    let hash = this.hash(index);    

    while (!hash.startsWith(startingPattern)) {
      index++;
      hash = this.hash(index);
    }

    return index;
  }

  private hash(i: number) {
    return new Md5()
      .update(this.secret + i)
      .toString('hex');
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    return new Miner(input);
  }

  public partOne(miner: ReturnType<this["parse"]>): number {
    return miner.mine("00000");
  }

  public partTwo(input: ReturnType<this["parse"]>): number {
    return input.mine("000000");
  }
}
