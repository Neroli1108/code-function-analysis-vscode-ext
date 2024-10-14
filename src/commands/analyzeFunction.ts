import * as vscode from "vscode";
import { analyzeCodeWithLLM } from "../llmService";
import { expandSelectionToFullFunction } from "../utils/functionCapture";
import { displayResults } from "../utils/displayResults";

export async function analyzeFunction(editor: vscode.TextEditor) {
  const document = editor.document;
  let selection = editor.selection;

  // Expand selection to the full function if it's a single line
  selection = expandSelectionToFullFunction(document, selection);

  const code = editor.document.getText(selection);
  const fileName = editor.document.fileName;
  const languageId = editor.document.languageId;

  vscode.window.setStatusBarMessage("Code Analysis: Analyzing...");

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Analyzing function...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      let analysisResult: string | null = null;

      try {
        analysisResult = await analyzeCodeWithLLM(code, languageId, fileName);
      } catch (error) {
        vscode.window.setStatusBarMessage("Code Analysis: Retry...");
        try {
          analysisResult = await analyzeCodeWithLLM(code, languageId, fileName);
        } catch (retryError) {
          vscode.window.showErrorMessage(
            "Failed to analyze the selection. Please try again later."
          );
        }
      }

      if (analysisResult) {
        displayResults(analysisResult);
        vscode.window.setStatusBarMessage("Code Analysis: Complete");
      } else {
        vscode.window.setStatusBarMessage("Code Analysis: Failed");
      }

      progress.report({ increment: 100 });
    }
  );
}
