// src/types/smoothie.d.ts

declare class SmoothieChart {
  constructor(options?: any);
  addTimeSeries(series: any, options?: any): void;
  streamTo(canvas: HTMLCanvasElement, delay?: number): void;
}

declare class TimeSeries {
  append(time: number, value: number): void;
}
