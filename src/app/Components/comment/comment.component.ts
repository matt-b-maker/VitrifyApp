import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Comment } from 'src/app/Models/commentModel';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { v4 as uuidv4 } from 'uuid';
import { IonIcon, IonLabel, IonItem, IonAvatar, IonButton, IonInput } from "@ionic/angular/standalone";
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-comment',
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  imports: [IonInput, IonButton, IonAvatar, IonItem, IonLabel, IonIcon,
    CommonModule
  ]
})
export class CommentComponent {

  @Input() comment!: Comment;
  @Output() reply: EventEmitter<Comment> = new EventEmitter();

  replyContent: string = '';
  replyOn: boolean = false;

  constructor(private auth: AuthService, private firestoreService: FirestoreService) { }

  getDate(date: Date | Timestamp) {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return date.toDate().toLocaleDateString();
  }

  setReplyContent(event: any) {
    this.replyContent = event.target.value;
  }

  onReply() {
    if (this.replyContent.trim() && this.replyContent.trim().length > 0){
      const newReply = new Comment(
        uuidv4(),
        this.auth.userMeta?.photoUrl || this.auth.user?.photoURL || '',
        this.replyContent,
        this.auth.userMeta?.nickname || this.auth.userMeta?.displayName || 'user unknown',
        this.auth.userMeta?.uid || '',
        this.comment.id,
        this.comment.recipeId,
      );
      newReply.type = 'reply';
      console.log(newReply);
      this.reply.emit(newReply);
      this.replyContent = '';
    }
    this.replyOn = false;
  }

  onNestedReply(event: Comment) {
    this.reply.emit(event);
    this.replyOn = false;
  }
}
