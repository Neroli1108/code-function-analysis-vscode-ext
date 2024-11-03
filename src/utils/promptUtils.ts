// src/utils/promptUtils.ts

import * as vscode from "vscode";

export function buildPrompt(
  code: string,
  languageId: string,
  fileName: string
): string {
  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const feedbackLevel = (config.get("feedbackLevel") as string) || "simple";
  const focusAreas = (config.get("focusAreas") as string[]) || [
    "performance",
    "style",
    "readability",
    "complexity",
  ];

  let styleGuide = "";

  switch (languageId) {
    case "python":
      styleGuide = "PEP 8";
      break;
    case "javascript":
      styleGuide = "Airbnb JavaScript Style Guide";
      break;
    case "java":
      styleGuide = "Google Java Style Guide";
      break;
    case "cpp":
      styleGuide = "C++ Core Guidelines";
      break;
    default:
      styleGuide = "standard conventions";
      break;
  }

  const focusAreasText = focusAreas.join(", ");

  let feedbackInstruction =
    feedbackLevel === "verbose"
      ? `Provide detailed feedback with pros and cons of each suggestion. If there are mistakes in the code, highlight them, correct the code, and explain why the changes improve it. Act like a mentor, guiding the user to write better code.`
      : `Provide concise feedback. If there are mistakes in the code, highlight them, provide corrections, and explain why the changes improve the code.`;

  return `You are a code review assistant. Analyze the following ${languageId} function from the file ${fileName} according to ${styleGuide} and focus on ${focusAreasText}. If the code contains errors or areas of improvement, highlight those issues, provide corrected code, and explain why the changes improve the code, like a mentor helping a student. Include an analysis of the function's time and space complexity where applicable.

Code:
${code}
`;
}

export function buildUnitTestPrompt(
  code: string,
  languageId: string,
  fileName: string
): string {
  return `You are an expert software engineer. Generate a comprehensive set of unit tests for the following ${languageId} function, including edge cases and boundary tests. Use the best practices and conventions for unit testing in ${languageId}.

Function Code:
${code}`;
}

export function buildFrontendPrompt(htmlCode: string): string {
  return `You are a frontend developer assistant. Given the following HTML code, generate corresponding CSS styles and JavaScript code to enhance the functionality and styling of the webpage. Ensure that the CSS is well-structured and follows best practices, and that the JavaScript adds interactive features where appropriate.

HTML Code:
${htmlCode}`;
}

export function buildCommitMessagePrompt(diff: string): string {
  return `You are an AI assistant that writes concise and descriptive git commit messages based on the provided diff of code changes. Analyze the following diff and generate an appropriate commit message that summarizes the changes.

Diff:
${diff}

Commit Message:`;
}

export function handleApiError(error: any, providerName: string) {
  if (error.response) {
    console.error(`${providerName} API Response Error:`, error.response.data);
    const status = error.response.status;
    const statusText = error.response.statusText;
    const errorData = error.response.data;

    let errorMessage = `${providerName} API error: ${status} ${statusText}`;
    if (errorData && (errorData.error || errorData.message)) {
      errorMessage += `\nDetails: ${errorData.error || errorData.message}`;
    }

    vscode.window.showErrorMessage(errorMessage);
  } else if (error.request) {
    console.error(
      `No response received from ${providerName} API:`,
      error.request
    );
    vscode.window.showErrorMessage(
      `No response received from ${providerName} API. Please check your network connection.`
    );
  } else {
    console.error(`Error in ${providerName} API request:`, error.message);
    vscode.window.showErrorMessage(
      `Error in ${providerName} API request: ${error.message}`
    );
  }
}
