import { Segment } from "./segment";

export class FiringSchedule {
  id: string = '';
  uid: string = '';
  name: string = '';
  description: string = '';
  dateCreated: Date = new Date();
  dateModified: Date = new Date();
  segments: Segment[] = [];
  tempScale: string = 'F'; // F or C
  maxTemp: number = 2232;

  constructor(id: string, uid: string, name: string, description: string, segments: Segment[]) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.description = description;
    this.segments = segments;
  }
}
