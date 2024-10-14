import * as vscode from "vscode";
import { handleApiError } from "./errorHandler";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Reusable function for making API requests to OpenAI, HuggingFace, or GoogleGemini
export async function callProvider(
  prompt: string,
  config: vscode.WorkspaceConfiguration,
  maxTokens: number
): Promise<string> {
  const provider = (config.get("apiProvider") as string) || "HuggingFace";
  switch (provider) {
    case "OpenAI":
      return await callOpenAI(prompt, config, maxTokens);
    case "HuggingFace":
      return await callHuggingFace(prompt, config);
    case "GoogleGemini":
      return await callGoogleGemini(prompt, config);
    default:
      vscode.window.showErrorMessage("Invalid API provider selected.");
      return "";
  }
}

// OpenAI call
async function callOpenAI(
  prompt: string,
  config: vscode.WorkspaceConfiguration,
  maxTokens: number
): Promise<string> {
  const apiKey = config.get("openAIApiKey") as string;
  if (!apiKey) {
    vscode.window.showErrorMessage("OpenAI API key is not set.");
    return "";
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    handleApiError(error, "OpenAI");
    return "";
  }
}

// HuggingFace call
async function callHuggingFace(
  prompt: string,
  config: vscode.WorkspaceConfiguration
): Promise<string> {
  const apiKey = config.get("huggingFaceApiKey") as string;
  const model =
    (config.get("huggingFaceModel") as string) || "EleutherAI/gpt-neo-2.7B";
  if (!apiKey) {
    vscode.window.showErrorMessage("Hugging Face API key is not set.");
    return "";
  }

  const payload: any = { inputs: prompt };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
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
      return "";
    }
  } catch (error: any) {
    handleApiError(error, "Hugging Face");
    return "";
  }
}

// Google Gemini call
async function callGoogleGemini(
  prompt: string,
  config: vscode.WorkspaceConfiguration
): Promise<string> {
  const apiKey = config.get("googleGeminiApiKey") as string;
  const model_name =
    (config.get("googleGeminiModel") as string) || "gemini-1.5-flash";

  if (!apiKey) {
    vscode.window.showErrorMessage("Google Gemini API key is not set.");
    return "";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: model_name });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    handleApiError(error, "Google Gemini");
    return "";
  }
}
