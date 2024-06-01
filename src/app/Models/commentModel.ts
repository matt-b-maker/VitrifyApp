export class Comment {
  id: string = '';
  creatorProfileImageUrl: string = '';
  creatorName: string = '';
  creatorUid: string = '';
  dateCreated: Date = new Date();
  content: string = '';
  type: string = 'post';
  parentCommentId: string = '';
  recipeId: string = '';
  comments: Comment[] = [];

  constructor(id: string, creatorProfileImageUrl: string, content: string, creatorName: string, creatorUid: string, parentCommentId: string, recipeId: string) {
    this.id = id;
    this.creatorProfileImageUrl = creatorProfileImageUrl;
    this.content = content;
    this.creatorName = creatorName;
    this.creatorUid = creatorUid;
    this.parentCommentId = parentCommentId;
    this.recipeId = recipeId;
  }
}
