/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const sendCommentNotificationOnCreate = functions.firestore
  .document("comments/{commentId}")
  .onCreate(async (snap) => {
    const comment = snap.data();
    console.log("New comment added:", comment);
    await handleCommentNotification(comment);
  });

export const sendCommentNotificationOnUpdate = functions.firestore
  .document("comments/{commentId}")
  .onUpdate(async (change) => {
    const comment = change.after.data();
    const oldComment = change.before.data();
    const changes = Object.keys(comment).filter((key) => comment[key] !== oldComment[key]);
    console.log("Comment updated:", comment);
    await handleCommentNotification(changes);
  });

// eslint-disable-next-line require-jsdoc
async function handleCommentNotification(comment: any): Promise<void> {
  console.log("HEYOOOOOOOOOO new comment: " + comment.parentCommentId);
  const commentType = comment.type;
  console.log("Comment type:", commentType);

  if (commentType === "post") {
    const recipe = await admin.firestore().collection("recipes").doc(comment.recipeId).get();
    if (!recipe.exists) {
      console.error("Recipe not found");
      return;
    }
    const ownerUid = recipe.data()?.uid;
    if (!ownerUid) {
      console.error("Recipe owner UID not found");
      return;
    }

    if (ownerUid === comment.creatorUid) {
      console.log("Owner is the one commenting");
      return;
    }

    const ownerDoc = await admin.firestore().collection("users").doc(ownerUid).get();

    if (!ownerDoc.exists) {
      console.error("Recipe owner not found");
      return;
    }

    const ownerData = ownerDoc.data();

    if (!ownerData) {
      console.error("Recipe owner data not found");
      return;
    }

    const ownerToken = ownerData.fcmToken;

    if (!ownerToken) {
      console.error("Recipe owner FCM token not found");
      return;
    }

    const payload = {
      message: {
        token: ownerToken,
        notification: {
          title: `New Comment for ${recipe.data()?.name}`,
          body: comment.content,
        },
        data: {
          recipeId: comment.recipeId,
        },
      },
    };

    const response = await admin.messaging().send(payload.message);
    console.log("Successfully sent message:", response);
    return;
  }

  const parentCommentId = comment.parentCommentId;
  console.log("Parent comment ID:", parentCommentId);
  if (!parentCommentId) return;

  const parentCommentDoc = await admin.firestore().collection("comments").doc(parentCommentId).get();
  console.log("Parent comment doc:", parentCommentDoc);

  const parentComment = parentCommentDoc.data();
  if (!parentComment) return;

  const parentCommentUserId = parentComment.creatorUid;
  console.log("Parent comment user ID:", parentCommentUserId);

  try {
    const userDoc = await admin.firestore().collection("users").doc(parentCommentUserId).get();
    if (!userDoc.exists) {
      throw new Error("User document not found");
    }
    console.log("User doc:", userDoc);
    const userData = userDoc.data();
    const token = userData?.fcmToken;

    console.log("User FCM token:", token);

    if (!token) {
      throw new Error("User FCM token not found");
    }

    const payload = {
      message: {
        token: token,
        notification: {
          title: "Comment Updated",
          body: `New reply: ${comment.content}`,
        },
        data: {
          recipeId: comment.recipeId,
        },
      },
    };

    const response = await admin.messaging().send(payload.message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
