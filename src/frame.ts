import { BaseGrid, Range } from './grid';

// integer math
// https://claude.ai/chat/9d46e364-54d4-4f28-acdd-4cb04f48f9d3
export class Frame extends BaseGrid<Uint8ClampedArray> {
  private channels = ['R', 'G', 'B', 'A'];
  constructor(width: number, height: number, initialData?: Uint8ClampedArray) {
    super(width, height);
    this.data = initialData || new Uint8ClampedArray(width * height);
  }

  get(x: number, y: number): number {
    this.validatePosition(x, y);
    return this.data[y * this.width + x];
  }

  getFromChannel(x: number, y: number, plane: number): number {
    return this.get(x * this.channels.length + plane, y);
  }

  toFlat(): Uint8ClampedArray {
    return this.data;
  }

  set(x: number, y: number, value: number): void {
    this.validatePosition(x, y);
    this.data[y * this.width + x] = value;
  }

  clone(): Frame {
    return new Frame(this.width, this.height, new Uint8ClampedArray(this.data));
  }

  // Frame specific methods
  fill(value: number): void {
    this.data.fill(value);
  }

  fillRect(range: Range, value: number): void {
    this.validateRange(range);
    for (let y = range.start.y; y <= range.end.y; y++) {
      for (let x = range.start.x; x <= range.end.x; x++) {
        this.set(x, y, value);
      }
    }
  }

  // Binary operations
  bitwiseAnd(other: Frame): Frame {
    if (this.width !== other.width || this.height !== other.height) {
      throw new Error('Grids must have the same dimensions');
    }
    const result = new Frame(this.width, this.height);
    for (let i = 0; i < this.data.length; i++) {
      result.data[i] = this.data[i] & other.data[i];
    }
    return result;
  }

  bitwiseOr(other: Frame): Frame {
    if (this.width !== other.width || this.height !== other.height) {
      throw new Error('Grids must have the same dimensions');
    }
    const result = new Frame(this.width, this.height);
    for (let i = 0; i < this.data.length; i++) {
      result.data[i] = this.data[i] | other.data[i];
    }
    return result;
  }

  // Export methods
  toArray(): number[][] {
    const result: number[][] = [];
    for (let y = 0; y < this.height; y++) {
      result[y] = Array.from(
        this.data.slice(y * this.width, (y + 1) * this.width)
      );
    }
    return result;
  }

  static fromArray(array: number[][]): Frame {
    const height = array.length;
    const width = array[0].length;
    const grid = new Frame(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid.set(x, y, array[y][x]);
      }
    }
    return grid;
  }
}
