export class Vector2 {
  public constructor(
    public x: number,
    public y: number,
  ) {}

  public add(other: Vector2): Vector2 {
    return new Vector2(
      this.x + other.x,
      this.y + other.y,
    );
  }

  public multiply(scalar: number): Vector2 {
    return new Vector2(
      this.x * scalar,
      this.y * scalar,
    );
  }

  public isEqual(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

export class Vector3 {
  public constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public add(other: Vector3): Vector3 {
    return new Vector3(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
    );
  }

  public multiply(scalar: number): Vector3 {
    return new Vector3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
    );
  }

  public isEqual(other: Vector3): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  public static fromString(input: string): Vector3 {
    const data = input
      .split(",")
      .map((n) => n.trim())
      .map((n) => parseInt(n));

    if (data.length !== 3) {
      throw new Error("Invalid input");
    }

    if (data.some((n) => isNaN(n))) {
      throw new Error("Invalid input");
    }

    return new Vector3(data[0], data[1], data[2]);
  }
}