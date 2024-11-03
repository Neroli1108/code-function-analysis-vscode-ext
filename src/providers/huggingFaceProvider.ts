// src/providers/huggingFaceProvider.ts

import axios from "axios";
import * as vscode from "vscode";
import { LLMProvider } from "./llmProvider";
import {
  buildPrompt,
  buildUnitTestPrompt,
  buildFrontendPrompt,
  buildCommitMessagePrompt,
  handleApiError,
} from "../utils/promptUtils";

export class HuggingFaceProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
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

  async generateCodeFromImage(imagePath: string): Promise<string> {
    throw new Error("Image-to-code feature is not supported by this provider.");
  }

  private async callAPI(prompt: string): Promise<string> {
    const payload: any = { inputs: prompt };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const modelsSupportingParameters = [
      "EleutherAI/gpt-neo-2.7B",
      "bigscience/bloom-1b1",
      "google/flan-t5-large",
      "facebook/opt-1.3b",
      "nvidia/NVLM-D-72B",
    ];

    if (modelsSupportingParameters.includes(this.model)) {
      payload.parameters = {
        max_new_tokens: 700,
        temperature: 0.7,
      };
    }

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        payload,
        { headers }
      );

      if (response.data && response.data.generated_text) {
        return response.data.generated_text.trim();
      } else if (Array.isArray(response.data)) {
        return response.data[0].generated_text.trim();
      } else {
        vscode.window.showErrorMessage(
          "Unexpected response format from Hugging Face API."
        );
        console.error("Response:", response.data);
        return "";
      }
    } catch (error: any) {
      handleApiError(error, "Hugging Face");
      return "";
    }
  }
}
