import { Injectable } from '@angular/core';
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor() { }

  async  downloadAndSaveImage(url: string, filename: string): Promise<string> {
    if (url === '') {
      return Promise.reject('URL is empty');
    }

    try {
      // Fetch the image data
      const response = await fetch(encodeURI(url));
      const blob = await response.blob();

      // Convert blob to base64 string
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      // Write the base64 data to a file
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Data,
      });

      return savedFile.uri;
    } catch (error) {
      console.error('Error downloading and saving image:', error);
      return Promise.reject(error);
    }
  }

  async getSavedImage(fileUri: string): Promise<ReadFileResult | null> {
    try {
      // Read the file data
      const file = await Filesystem.readFile({
        path: fileUri.replace('/DATA/', ''),
        directory: Directory.Data,
      });
      // Return the file data
      return file;
    } catch (error) {
      console.error('Error reading saved image:', error);
      return null;
    }
  }
}
