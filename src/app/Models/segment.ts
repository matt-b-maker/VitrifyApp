export class Segment {
  lowTemp: number;
  highTemp: number;
  duration: string = '00:01';
  hold: boolean = false;
  type: string = '';

  constructor(lowTemp: number, highTemp: number, duration: string, type: string = 'ramp') {
    this.lowTemp = lowTemp;
    this.highTemp = highTemp;
    this.duration = duration;
    this.type = type;
  }
}
