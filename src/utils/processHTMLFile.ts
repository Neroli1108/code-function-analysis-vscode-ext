import * as vscode from "vscode";
import { readFileSync, existsSync } from "fs";
import { displayResults } from "./displayResults";
import { generateFrontendTemplateWithLLM } from "../llmService";

export async function processHTMLFile(fileName: string) {
  vscode.window.setStatusBarMessage(
    "Frontend Template Generator: Processing HTML File..."
  );

  if (!existsSync(fileName)) {
    vscode.window.showErrorMessage(`File ${fileName} not found.`);
    vscode.window.setStatusBarMessage("Frontend Template Generator: Failed");
    return;
  }

  try {
    const htmlContent = readFileSync(fileName, "utf-8");
    const template = await generateFrontendTemplateWithLLM(
      htmlContent,
      "html",
      fileName
    );

    if (template) {
      displayResults(template, "Generated Frontend Template from HTML");
      vscode.window.setStatusBarMessage(
        "Frontend Template Generator: Complete"
      );
    } else {
      vscode.window.setStatusBarMessage("Frontend Template Generator: Failed");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to process HTML file: ${error}`);
    vscode.window.setStatusBarMessage("Frontend Template Generator: Failed");
  }
}
