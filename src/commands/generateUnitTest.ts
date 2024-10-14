import * as vscode from "vscode";
import { generateFunctionUnitTest } from "../llmService";
import { expandSelectionToFullFunction } from "../utils/functionCapture";
import { displayResults } from "../utils/displayResults";

export async function generateUnitTest(editor: vscode.TextEditor) {
  const document = editor.document;
  let selection = editor.selection;

  // Expand selection to the full function if it's a single line
  selection = expandSelectionToFullFunction(document, selection);

  const code = editor.document.getText(selection);
  const fileName = editor.document.fileName;
  const languageId = editor.document.languageId;

  vscode.window.setStatusBarMessage("Unit Test Generation: Generating...");

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating unit test...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      let unitTestResult: string | null = null;

      try {
        unitTestResult = await generateFunctionUnitTest(
          code,
          languageId,
          fileName
        );
      } catch (error) {
        vscode.window.setStatusBarMessage("Unit Test Generation: Retry...");
        try {
          unitTestResult = await generateFunctionUnitTest(
            code,
            languageId,
            fileName
          );
        } catch (retryError) {
          vscode.window.showErrorMessage(
            "Failed to generate unit test. Please try again later."
          );
        }
      }

      if (unitTestResult) {
        displayResults(unitTestResult);
        vscode.window.setStatusBarMessage("Unit Test Generation: Complete");
      } else {
        vscode.window.setStatusBarMessage("Unit Test Generation: Failed");
      }

      progress.report({ increment: 100 });
    }
  );
}
