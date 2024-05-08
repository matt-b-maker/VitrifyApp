import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) { }

  // Upload file and return the URL as a string
  async uploadFile(filePath: string, file: File): Promise<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    await task.snapshotChanges().toPromise(); // Wait until the upload is complete
    return await fileRef.getDownloadURL().toPromise(); // Return the download URL
  }

  // Retrieve file URL
  async getFileUrl(filePath: string): Promise<string> {
    return await this.storage.ref(filePath).getDownloadURL().toPromise();
  }

  // Update file (essentially a re-upload, as Firebase Storage overwrites existing files at the path)
  async updateFile(filePath: string, file: File): Promise<string> {
    return await this.uploadFile(filePath, file);  // Reuse uploadFile since it overwrites by default
  }

  // Delete file
  async deleteFile(filePath: string): Promise<void> {
    return await this.storage.ref(filePath).delete().toPromise();
  }
}
