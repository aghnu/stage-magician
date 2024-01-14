export interface Vector {
  x: number;
  y: number;
}

export interface ElementRectConfig {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface OffsetOption<T extends string> {
  option: T;
  offset: Vector;
}
