import { Segment } from "./segment";
import { Comment } from "./commentModel";

export class FiringSchedule {
  id: string = '';
  uid: string = '';
  name: string = '';
  description: string = '';
  dateCreated: Date = new Date();
  dateModified: Date = new Date();
  segments: Segment[] = [];
  tempScale: string = 'F'; // F or C
  maxCone: string = '6'; // 022 - 10
  creator: string = '';
  maxTemp: number = 2232;
  likes: number = 0;
  comments: Comment[] = [];

  constructor(id: string, uid: string, name: string, description: string, segments: Segment[]) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.description = description;
    this.segments = segments;
  }
}
