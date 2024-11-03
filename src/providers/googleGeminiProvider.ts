// src/providers/googleGeminiProvider.ts

import * as vscode from "vscode";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { LLMProvider } from "./llmProvider";
import {
  buildPrompt,
  buildUnitTestPrompt,
  buildFrontendPrompt,
  buildCommitMessagePrompt,
  handleApiError,
} from "../utils/promptUtils";
import * as fs from "fs";
import * as path from "path";

export class GoogleGeminiProvider implements LLMProvider {
  private apiKey: string;
  private modelName: string;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string, modelName: string) {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.genAI = new GoogleGenerativeAI(apiKey);
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
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      // Read the image file
      const imageBuffer = fs.readFileSync(imagePath);

      // Determine the content type based on the file extension
      const extension = path.extname(imagePath).toLowerCase();
      let contentType = "image/jpeg"; // default to JPEG

      if (extension === ".png") {
        contentType = "image/png";
      } else if (extension === ".gif") {
        contentType = "image/gif";
      } else if (extension === ".jpg" || extension === ".jpeg") {
        contentType = "image/jpeg";
      } else {
        vscode.window.showErrorMessage("Unsupported image format.");
        return "";
      }

      // Convert image to Base64
      const base64Image = imageBuffer.toString("base64");

      // Create the image part as per the SDK's requirements
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: contentType,
        },
      };

      // Create a prompt or question for the model
      const prompt =
        "Generate HTML, CSS, and JavaScript code based on the following image of a webpage layout.";

      // Call the generateContent method with the prompt and image part
      const response = await model.generateContent([prompt, imagePart]);

      return response.response.text();
    } catch (error: any) {
      handleApiError(error, "Google Gemini");
      return "";
    }
  }

  private async callAPI(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      handleApiError(error, "Google Gemini");
      return "";
    }
  }
}
