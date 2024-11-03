// src/services/llmService.ts

import * as vscode from "vscode";
import { LLMProvider } from "../providers/llmProvider";
import { OpenAIProvider } from "../providers/openaiProvider";
import { HuggingFaceProvider } from "../providers/huggingFaceProvider";
import { GoogleGeminiProvider } from "../providers/googleGeminiProvider";

export class LLMService {
  private provider: LLMProvider;

  constructor(config: vscode.WorkspaceConfiguration) {
    const providerName = config.get("apiProvider") as string;
    switch (providerName) {
      case "OpenAI":
        const openAIApiKey = config.get("openAIApiKey") as string;
        if (!openAIApiKey) {
          throw new Error("OpenAI API key is not set.");
        }
        this.provider = new OpenAIProvider(openAIApiKey);
        break;
      case "HuggingFace":
        const huggingFaceApiKey = config.get("huggingFaceApiKey") as string;
        const huggingFaceModel = config.get("huggingFaceModel") as string;
        if (!huggingFaceApiKey) {
          throw new Error("Hugging Face API key is not set.");
        }
        this.provider = new HuggingFaceProvider(
          huggingFaceApiKey,
          huggingFaceModel
        );
        break;
      case "GoogleGemini":
        const googleGeminiApiKey = config.get("googleGeminiApiKey") as string;
        const modelName = config.get("googleGeminiModel") as string;
        if (!googleGeminiApiKey) {
          throw new Error("Google Gemini API key is not set.");
        }
        this.provider = new GoogleGeminiProvider(googleGeminiApiKey, modelName);
        break;
      default:
        throw new Error("Invalid API provider selected.");
    }
  }

  analyzeCode(
    code: string,
    languageId: string,
    fileName: string
  ): Promise<string> {
    return this.provider.analyzeCode(code, languageId, fileName);
  }

  generateUnitTest(
    code: string,
    languageId: string,
    fileName: string
  ): Promise<string> {
    return this.provider.generateUnitTest(code, languageId, fileName);
  }

  generateFrontendCode(htmlCode: string): Promise<string> {
    return this.provider.generateFrontendCode(htmlCode);
  }

  generateCommitMessage(diff: string): Promise<string> {
    return this.provider.generateCommitMessage(diff);
  }
}
