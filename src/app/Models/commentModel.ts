export class Comment {
  id: string = '';
  creatorName: string = '';
  creatorUid: string = '';
  dateCreated: Date = new Date();
  comments: Comment[] = [];
  content: string = '';

  constructor(id: string, comments: Comment[]) {
    this.id = id;
    this.comments = comments;
  }
}
