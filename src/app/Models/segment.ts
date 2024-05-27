export class Segment {
  lowTemp: number;
  highTemp: number;
  duration: string = '00:01';
  hold: boolean = false;

  constructor(lowTemp: number, highTemp: number, duration: string) {
    this.lowTemp = lowTemp;
    this.highTemp = highTemp;
    this.duration = duration;
  }
}
