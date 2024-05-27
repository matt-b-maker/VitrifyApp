import { createForm } from "openai/uploads";
import { TestTile } from "./testTileModel";
import { Timestamp } from "rxjs";
import { Status } from "./status";

export class TestBatch {

  id: string = "";
  uid: string = "";
  name: string = "";
  tiles: TestTile[] = [];
  creator: string = "";
  dateCreated: Date = new Date();
  dateModified: Date = new Date();
  dateCompleted: Date = new Date();
  descriptionString: string = "";
  dateCreatedFormatted: string = "";
  dateCompletedFormatted: string = "";
  status: Status = Status.InProgress;

  constructor(id: string, uid: string, name: string, tiles: TestTile[]) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.tiles = tiles;
  }
}
