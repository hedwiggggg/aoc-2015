import { GenericDay } from "~/utils/day.ts";

interface IInstruction {
  inRegister: string[];
  outRegister: string[];

  apply(circuit: Circuit): void;
}

function Instruction(pattern: RegExp) {
  abstract class Instruction implements IInstruction {
    public inRegister: string[] = [];
    public outRegister: string[] = [];

    public abstract apply(circuit: Circuit): void;

    public static pattern = pattern;
    public static fromRaw(raw: string): Instruction {
      const [_, ...rest] = raw.match(pattern)!;
      return new (this as any)(...rest);
    }
  }

  return Instruction;
}

const ASSIGNMENT_PATTERN = /^([a-z]+|\d+) -> ([a-z]+)$/;
class Assignment extends Instruction(ASSIGNMENT_PATTERN) {
  public input: number | string;
  public output: string;

  public constructor(
    input: string,
    output: string,
  ) {
    super();
  
    this.input = Number(input) || input;
    this.output = output;

    this.outRegister.push(this.output);
    
    if (typeof this.input === 'string')
      this.inRegister.push(this.input);
  }

  public apply(circuit: Circuit) {
    circuit.register[this.output] = typeof this.input === 'string'
      ? circuit.register[this.input]
      : this.input;
  }
}

const AND_PATTERN = /^([a-z]+|\d+) AND ([a-z]+|\d+) -> ([a-z]+)$/;
class And extends Instruction(AND_PATTERN) {
  public input0: number | string;
  public input1: number | string;
  public output: string;

  public constructor(
    input0: string,
    input1: string,
    output: string,
  ) {
    super();

    this.input0 = Number(input0) || input0;
    this.input1 = Number(input1) || input1;
    this.output = output;

    this.outRegister.push(this.output);
    
    if (typeof this.input0 === 'string')
      this.inRegister.push(this.input0);

    if (typeof this.input1 === 'string')
      this.inRegister.push(this.input1);
  }

  public apply(circuit: Circuit) {
    const input0 = typeof this.input0 === 'string'
      ? circuit.register[this.input0]
      : this.input0;

    const input1 = typeof this.input1 === 'string'
      ? circuit.register[this.input1]
      : this.input1;

    circuit.register[this.output] = input0 & input1;
  }
}

const OR_PATTERN = /^([a-z]+|\d+) OR ([a-z]+|\d+) -> ([a-z]+)$/;
class Or extends Instruction(OR_PATTERN) {
  public input0: number | string;
  public input1: number | string;
  public output: string;

  public constructor(
    input0: string,
    input1: string,
    output: string,
  ) {
    super();

    this.input0 = Number(input0) || input0;
    this.input1 = Number(input1) || input1;
    this.output = output;

    this.outRegister.push(this.output);

    if (typeof this.input0 === 'string')
      this.inRegister.push(this.input0);

    if (typeof this.input1 === 'string')
      this.inRegister.push(this.input1);
  }

  public apply(circuit: Circuit) {
    const input0 = typeof this.input0 === 'string'
      ? circuit.register[this.input0]
      : this.input0;

    const input1 = typeof this.input1 === 'string'
      ? circuit.register[this.input1]
      : this.input1;

    circuit.register[this.output] = input0 | input1;
  }
}

const LSHIFT_PATTERN = /^([a-z]+) LSHIFT (\d+) -> ([a-z]+)$/;
class LShift extends Instruction(LSHIFT_PATTERN) {
  public constructor(
    public input: string,
    public shift: number,
    public output: string,
  ) {
    super();

    this.outRegister.push(this.output);
    this.inRegister.push(this.input);
  }

  public apply(circuit: Circuit) {
    circuit.register[this.output] = circuit.register[this.input] << this.shift;
  }
}

const RSHIFT_PATTERN = /^([a-z]+) RSHIFT (\d+) -> ([a-z]+)$/;
class RShift extends Instruction(RSHIFT_PATTERN) {
  public constructor(
    public input: string,
    public shift: number,
    public output: string,
  ) {
    super();

    this.outRegister.push(this.output);
    this.inRegister.push(this.input);
  }

  public apply(circuit: Circuit) {
    circuit.register[this.output] = circuit.register[this.input] >> this.shift;
  }
}

const NOT_PATTERN = /^NOT ([a-z]+) -> ([a-z]+)$/;
class Not extends Instruction(NOT_PATTERN) {
  public constructor(
    public input: string,
    public output: string,
  ) {
    super();

    this.outRegister.push(this.output);
    this.inRegister.push(this.input);
  }

  public apply(circuit: Circuit) {
    circuit.register[this.output] = ~circuit.register[this.input] >>> 0 & 0xFFFF;
  }
}

type Instruction = typeof Instructions[number];
const Instructions = [
  Assignment,
  And,
  Or,
  LShift,
  RShift,
  Not,
];

class Circuit {
  public register: Record<string, number> = {};
  public constructor(
    public instructions: IInstruction[],
  ) {}

  public processInstructionsFor(forRegister: string) {
    const instructions = [] as IInstruction[];

    let target = [forRegister];

    while (target.length > 0) {
      const dependsOn = this.instructions.filter((instruction) => {
        return instruction.outRegister.some((register) => {
          return target.includes(register);
        });
      });

      instructions.unshift(...dependsOn);
      target = dependsOn.flatMap((instruction) => instruction.inRegister);
    }

    instructions.forEach((instruction) => {
      instruction.apply(this);
    });

    return this;
  }

  public getValueFor(register: string) {
    return this.register[register];
  }

  public overrideAssignment(register: string, value: number) {
    const assignment = this.instructions.find((instruction) => {
      return instruction instanceof Assignment && instruction.output === register;
    }) as Assignment;

    assignment.input = value;

    return this;
  }

  public reset() {
    this.register = {};
    return this;
  }

  public static fromRaw(raw: string) {
    const instructions = raw
      .split('\n')
      .map((raw) => {
        const instruction = Instructions.find((Instruction) => {
          return Instruction.pattern.test(raw);
        });

        if (!instruction) {
          throw new Error(`Invalid instruction: ${raw}`);
        }

        return instruction.fromRaw(raw);
      })

    return new Circuit(instructions);
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    return Circuit.fromRaw(input);
  }

  public partOne(circuit: ReturnType<this["parse"]>): number {
    return circuit
      .processInstructionsFor("a")
      .getValueFor("a");
  }

  public partTwo(input: ReturnType<this["parse"]>): number {
    const aValue = this.partOne(input);

    return input
      .reset()
      .overrideAssignment("b", aValue)
      .processInstructionsFor("a")
      .getValueFor("a");
  }
}
