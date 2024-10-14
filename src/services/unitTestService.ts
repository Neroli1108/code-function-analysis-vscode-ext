import * as vscode from "vscode";
import { callProvider } from "./providerHelper";

// Function to generate unit tests for a given code
export async function generateFunctionUnitTest(
  code: string,
  languageId: string,
  fileName: string
): Promise<string> {
  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const prompt = buildUnitTestPrompt(code, languageId, fileName, config);

  // Reuse the provider helper function
  return await callProvider(prompt, config, 1500);
}

// Helper function to build the unit test prompt, including fileName and config options
function buildUnitTestPrompt(
  code: string,
  languageId: string,
  fileName: string,
  config: vscode.WorkspaceConfiguration
): string {
  const testStyle = config.get("testStyle") || "default"; // Example config setting
  const focusAreas = (config.get("focusAreas") as string[]) || [
    "correctness",
    "edge cases",
  ];

  // Generate a prompt that includes both fileName and relevant configuration
  return `Generate a comprehensive set of unit tests for the function in the file "${fileName}" written in ${languageId}.
  Focus on: ${focusAreas.join(
    ", "
  )}. The test style should follow the "${testStyle}" convention.

  Code:
  ${code}`;
}
