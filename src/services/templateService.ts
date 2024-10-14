import * as vscode from "vscode";
import { callProvider } from "./providerHelper";

// Function to generate a frontend template based on input (HTML/screenshot)
export async function generateFrontendTemplateWithLLM(
  inputContent: string,
  inputType: string,
  fileName: string
): Promise<string> {
  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const prompt = `You are a fronetend engineer, Generate a frontend source code template including both JavaScript and CSS files from the following ${inputType} (${fileName}). Ensure that the JavaScript covers necessary interactive behaviors, and the CSS defines the layout and styling. Here's the content you should base the template on:\n\n${inputContent}\n\nProvide separate sections for JavaScript and CSS in your response.`;
  return await callProvider(prompt, config, 1500);
}
