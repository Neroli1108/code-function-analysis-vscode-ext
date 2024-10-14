import * as vscode from "vscode";
import { analyzeFunction } from "./commands/analyzeFunction";
import { generateUnitTest } from "./commands/generateUnitTest";
import { generateFrontendTemplateWithLLM } from "./commands/generateFrontendTemplate";
import { debounce } from "./utils/debounce"; // Debounce function for better performance

let statusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Initialize the status bar
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.text = "Code Analysis: Ready";
  statusBar.show();

  // Register the command for manual analysis
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.analyzeFunction",
      async (editor: vscode.TextEditor) => {
        if (editor) {
          statusBar.text = "Code Analysis: Analyzing...";
          await analyzeFunction(editor);
          statusBar.text = "Code Analysis: Ready";
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  // Register the command for generating unit tests
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.generateUnitTest",
      async (editor: vscode.TextEditor) => {
        if (editor) {
          statusBar.text = "Generating Unit Test...";
          await generateUnitTest(editor);
          statusBar.text = "Code Analysis: Ready";
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  // Register the command for generating frontend template
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.generateFrontendTemplate",
      async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
          const document = editor.document;
          const fileName = document.fileName.toLowerCase();
          const fileExtension = vscode.workspace
            .asRelativePath(fileName)
            .split(".")
            .pop()
            ?.toLowerCase();

          if (
            fileExtension === "html" ||
            fileExtension === "png" ||
            fileExtension === "jpg" ||
            fileExtension === "jpeg"
          ) {
            statusBar.text = "Generating Frontend Template...";
            await generateFrontendTemplateWithLLM(fileName, fileExtension);
            statusBar.text = "Code Analysis: Ready";
          } else {
            vscode.window.showErrorMessage(
              "This feature only works for HTML files or screenshots."
            );
          }
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  // Add the auto-analyze on selection logic
  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const autoAnalyze = config.get("autoAnalyzeOnSelection") as boolean;

  if (autoAnalyze) {
    context.subscriptions.push(
      vscode.window.onDidChangeTextEditorSelection(
        debounce(async (event: vscode.TextEditorSelectionChangeEvent) => {
          const editor = event.textEditor;
          const selection = editor.selection;

          // Only analyze if the selection is non-empty
          if (!selection.isEmpty) {
            statusBar.text = "Code Analysis: Analyzing...";
            await analyzeFunction(editor);
            statusBar.text = "Code Analysis: Ready";
          }
        }, 1000) // 1-second debounce delay
      )
    );
  }

  // Add the status bar to context subscriptions
  context.subscriptions.push(statusBar);
}

export function deactivate() {}
