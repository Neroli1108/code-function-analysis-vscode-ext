// src/providers/openaiProvider.ts

import axios from "axios";
import { LLMProvider } from "./llmProvider";
import {
  buildPrompt,
  buildUnitTestPrompt,
  buildFrontendPrompt,
  buildCommitMessagePrompt,
  handleApiError,
} from "../utils/promptUtils";

export class OpenAIProvider implements LLMProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeCode(
    code: string,
    languageId: string,
    fileName: string
  ): Promise<string> {
    const prompt = buildPrompt(code, languageId, fileName);
    return this.callAPI(prompt);
  }

  async generateUnitTest(
    code: string,
    languageId: string,
    fileName: string
  ): Promise<string> {
    const prompt = buildUnitTestPrompt(code, languageId, fileName);
    return this.callAPI(prompt);
  }

  async generateFrontendCode(htmlCode: string): Promise<string> {
    const prompt = buildFrontendPrompt(htmlCode);
    return this.callAPI(prompt);
  }

  async generateCommitMessage(diff: string): Promise<string> {
    const prompt = buildCommitMessagePrompt(diff);
    return this.callAPI(prompt);
  }

  private async callAPI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 700,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error: any) {
      handleApiError(error, "OpenAI");
      return "";
    }
  }
}
