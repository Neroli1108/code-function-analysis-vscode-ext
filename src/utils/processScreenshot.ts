import * as vscode from "vscode";
import Tesseract from "tesseract.js";
import { displayResults } from "./displayResults";
import { generateFrontendTemplateWithLLM } from "../llmService";

export async function processScreenshot(fileName: string) {
  vscode.window.setStatusBarMessage(
    "Frontend Template Generator: Processing Screenshot..."
  );

  try {
    const result = await Tesseract.recognize(fileName, "eng", {
      logger: (m) => console.log(m), // Log recognition progress
    });

    const extractedText = result.data.text.trim();

    if (!extractedText) {
      vscode.window.showErrorMessage("No text found in the screenshot.");
      vscode.window.setStatusBarMessage("Frontend Template Generator: Failed");
      return;
    }

    const template = await generateFrontendTemplateWithLLM(
      extractedText,
      "screenshot",
      fileName
    );

    if (template) {
      displayResults(template, "Generated Frontend Template from Screenshot");
      vscode.window.setStatusBarMessage(
        "Frontend Template Generator: Complete"
      );
    } else {
      vscode.window.setStatusBarMessage("Frontend Template Generator: Failed");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to process screenshot: ${error}`);
    vscode.window.setStatusBarMessage("Frontend Template Generator: Failed");
  }
}
