// https://claude.ai/chat/9d46e364-54d4-4f28-acdd-4cb04f48f9d3

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export abstract class BaseGrid<T> {
  protected data: T;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  protected validatePosition(x: number, y: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error(`Position (${x}, ${y}) is out of bounds`);
    }
  }

  protected validateRange(range: Range): void {
    this.validatePosition(range.start.x, range.start.y);
    this.validatePosition(range.end.x, range.end.y);
    if (range.start.x > range.end.x || range.start.y > range.end.y) {
      throw new Error(
        'Invalid range: start position must be before end position'
      );
    }
  }

  getSize(): Size {
    return { width: this.width, height: this.height };
  }

  abstract get(x: number, y: number): number;
  abstract set(x: number, y: number, value: number): void;
  abstract clone(): BaseGrid<T>;
}
