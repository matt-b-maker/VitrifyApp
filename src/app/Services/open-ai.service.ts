import { Injectable } from '@angular/core';
import OpenAi from 'openai';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private apiKey = environment.openAiApiKey;
  private openaiInstance: any;

  constructor() {
    this.openaiInstance = new OpenAi({ apiKey: this.apiKey, dangerouslyAllowBrowser: true });
  }

  async getCompletion(prompt: string): Promise<string> {
    // try {
    //   const response = await this.openaiInstance.complete({
    //     engine: 'text-davinci-003', // Specify the engine
    //     prompt: prompt,
    //     maxTokens: 1000
    //   });
    //   return response.data.choices[0].text;
    // } catch (error) {
    //   throw new Error('Error fetching data from OpenAI API: ' + error);
    // }
    try {
      const response = await this.openaiInstance.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
      return response.choices[0].message.content;
    }
    catch (error) {
      throw new Error('Error fetching data from OpenAI API: ' + error);
    }
  }
}
