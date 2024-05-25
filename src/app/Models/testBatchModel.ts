import { createForm } from "openai/uploads";
import { TestTile } from "./testTileModel";

export class TestBatch {

  id: string = "";
  uid: string = "";
  name: string = "";
  tiles: TestTile[] = [];
  creator: string = "";
  dateCreated: Date = new Date();
  dateModified: Date = new Date();
  descriptionString: string = "";

  constructor(id: string, uid: string, name: string, tiles: TestTile[]) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.tiles = tiles;
  }
}
