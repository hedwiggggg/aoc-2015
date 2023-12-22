import { GenericDay } from "~/utils/day.ts";

class Word {
  public constructor(
    public chars: string[],
  ) {}

  public isNiceA() {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const forbidden = ['ab', 'cd', 'pq', 'xy'];

    let vowelCount = 0;
    let hasDouble = false;
    let hasForbidden = false;

    for (let i = 0; i < this.chars.length; i++) {
      const char = this.chars[i];
      const nextChar = this.chars[i + 1];

      if (vowels.includes(char)) {
        vowelCount++;
      }

      if (char === nextChar) {
        hasDouble = true;
      }

      if (forbidden.includes(char + nextChar)) {
        hasForbidden = true;
      }
    }

    return vowelCount >= 3 && hasDouble && !hasForbidden;
  }

  public isNiceB() {
    const hasPairs = this.hasPairs();
    const hasRepeating = this.hasRepeating();

    return hasPairs && hasRepeating;
  }

  public hasPairs() {
    let hasPairs = false;

    for (let i = 0; i < this.chars.length; i++) {
      const char0 = this.chars[i];
      const char1 = this.chars[i + 1];

      const pair = char0 + char1;
      const rest = this.chars.slice(i + 2).join('');

      if (rest.includes(pair)) {
        hasPairs = true;
        break;
      }
    }

    return hasPairs;
  }

  public hasRepeating() {
    let hasRepeating = false;

    for (let i = 0; i < this.chars.length; i++) {
      const char0 = this.chars[i];
      const char2 = this.chars[i + 2];

      if (char0 === char2) {
        hasRepeating = true;
        break;
      }
    }

    return hasRepeating;
  }

  public static fromRaw(raw: string) {
    const chars = raw.split('');
    return new Word(chars);
  }
}

export class Day extends GenericDay {
  public parse(input: string) {
    const wordsRaw = input.split('\n');
    const words = wordsRaw.map((raw) => Word.fromRaw(raw));
    return words;
  }

  public partOne(words: ReturnType<this["parse"]>): number {
    return words.filter((word) => word.isNiceA()).length;
  }

  public partTwo(words: ReturnType<this["parse"]>): number {
    return words.filter((word) => word.isNiceB()).length;
  }
}
