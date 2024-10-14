import * as vscode from "vscode";
import { processScreenshot } from "../utils/processScreenshot";
import { processHTMLFile } from "../utils/processHTMLFile";

// Main function to handle template generation
export async function generateFrontendTemplateWithLLM(
  fileName?: string,
  fileType?: string
) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  // If fileName and fileType are passed explicitly
  if (fileName && fileType) {
    await handleTemplateGeneration(fileName, fileType);
    return;
  }

  // Handle case where no fileName and fileType are provided, default to active editor's file
  await handleTemplateGenerationFromActiveEditor(editor);
}

// Handles the template generation based on file type
async function handleTemplateGeneration(fileName: string, fileType: string) {
  if (fileType === "html") {
    await processHTMLFile(fileName);
  } else if (["png", "jpg", "jpeg"].includes(fileType)) {
    await processScreenshot(fileName);
  } else {
    vscode.window.showErrorMessage(
      "This feature can only generate templates from HTML or image files (PNG, JPG, JPEG)."
    );
  }
}

// Handles template generation when no fileName is passed and uses active editor's document
async function handleTemplateGenerationFromActiveEditor(
  editor: vscode.TextEditor
) {
  const document = editor.document;
  const activeFileName = document.fileName.toLowerCase();
  const fileExtension = getFileExtension(activeFileName);

  if (fileExtension === "html") {
    await processHTMLFile(activeFileName);
  } else if (["png", "jpg", "jpeg"].includes(fileExtension)) {
    await processScreenshot(activeFileName);
  } else {
    vscode.window.showErrorMessage(
      "This feature can only generate templates from HTML or image files (PNG, JPG, JPEG)."
    );
  }
}

// Utility function to extract file extension safely
function getFileExtension(fileName: string): string {
  return fileName.split(".").pop() || "";
}
