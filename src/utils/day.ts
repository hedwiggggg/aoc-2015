export abstract class GenericDay {
  public static __IS_GENERIC_DAY = true;
  
  public abstract parse(input: string): any;

  public abstract partOne(input: ReturnType<this['parse']>): number;
  public abstract partTwo(input: ReturnType<this['parse']>): number;

  public execute(input: string, part?: string): void {
    const transformedInputA = this.parse(input);
    const transformedInputB = this.parse(input);    

    if (part === '1' || part === undefined)
      console.log(`part one: ${this.partOne(transformedInputA)}`);

    if (part === '2' || part === undefined)
      console.log(`part two: ${this.partTwo(transformedInputB)}`);
  }
}

export function isDay(day: unknown): day is (new () => GenericDay) {
  if (typeof day !== 'function') return false;
  if (day === null) return false;
  if (!('__IS_GENERIC_DAY' in day)) return false;

  return day.__IS_GENERIC_DAY === true;
}
