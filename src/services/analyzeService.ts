import * as vscode from "vscode";
import { callProvider } from "./providerHelper";

// Analyzes the code using the LLM providers
export async function analyzeCodeWithLLM(
  code: string,
  languageId: string,
  fileName: string
): Promise<string> {
  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const prompt = buildPrompt(code, languageId, fileName, config);

  // Reuse the provider helper function, providing fileName context
  return await callProvider(prompt, config, 1500);
}

// Helper function to build the prompt with filename included
function buildPrompt(
  code: string,
  languageId: string,
  fileName: string,
  config: vscode.WorkspaceConfiguration
): string {
  const focusAreas = (config.get("focusAreas") as string[]) || [
    "performance",
    "style",
    "readability",
  ];

  return `Analyze the function in the file "${fileName}" written in ${languageId}. Focus on: ${focusAreas.join(
    ", "
  )}.\n\nCode:\n${code}`;
}
