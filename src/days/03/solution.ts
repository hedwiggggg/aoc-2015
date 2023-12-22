import { GenericDay } from "~/utils/day.ts";
import { Vector2 } from "~/utils/math.ts";

type Instruction = typeof Instruction[keyof typeof Instruction];
const Instruction = {
  '^': new Vector2(0, -1),
  'v': new Vector2(0, 1),
  '<': new Vector2(-1, 0),
  '>': new Vector2(1, 0),
};

class Santa {
  public constructor(
    public position: Vector2,
    public instructions: Instruction[],
  ) {}

  public deliverPresents() {
    const visited = new Set<string>([
      this.position.toString(),
    ]);

    this.instructions.forEach((instruction) => {
      this.position = this.position.add(instruction);
      visited.add(this.position.toString());
    });

    return visited;
  }

  public split() {
    const santas = [
      new Santa(new Vector2(0, 0), []),
      new Santa(new Vector2(0, 0), []),
    ];

    this.instructions.forEach((instruction, index) => {
      santas[index % 2].instructions.push(instruction);
    });

    return santas;
  }

  public static fromRaw(raw: string) {
    const instructionsRaw = raw.split('') as (keyof typeof Instruction)[];
    const instructions = instructionsRaw.map((raw) => Instruction[raw]);

    return new Santa(new Vector2(0, 0), instructions);
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    return Santa.fromRaw(input);
  }

  public partOne(santa: ReturnType<this["parse"]>): number {
    return santa.deliverPresents().size;
  }

  public partTwo(santa: ReturnType<this["parse"]>): number {
    const santas = santa.split();
    const realSanta = santas.at(0)!;
    const roboSanta = santas.at(1)!;

    const realSantaDeliveries = realSanta.deliverPresents();
    const roboSantaDeliveries = roboSanta.deliverPresents();

    const deliveries = new Set<string>([
      ...realSantaDeliveries,
      ...roboSantaDeliveries,
    ]);

    return deliveries.size;
  }
}
