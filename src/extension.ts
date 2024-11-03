// src/extension.ts

import * as vscode from "vscode";
import { LLMService } from "./services/llmService";
import { displayResults, DisplayResultsOptions } from "./ui/displayResults";
import { expandSelectionToFullFunction } from "./functionCapture";
import { exec } from "child_process";
import * as util from "util";

const execPromise = util.promisify(exec);

let debounceTimeout: NodeJS.Timeout | undefined;
let statusBar: vscode.StatusBarItem;
let selectionChangeSubscription: vscode.Disposable | undefined;
let autoAnalyze: boolean = false;

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("code-function-analysis");
  autoAnalyze = config.get("autoAnalyzeOnSelection") as boolean;

  // Initialize status bar item
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.text = "Code Analysis: Ready";
  statusBar.show();

  // Register commands and context menu commands
  registerCommands(context);

  // Handle configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("code-function-analysis.autoAnalyzeOnSelection")
      ) {
        autoAnalyze = vscode.workspace
          .getConfiguration("code-function-analysis")
          .get("autoAnalyzeOnSelection") as boolean;

        if (autoAnalyze) {
          enableAutoAnalyze(context);
        } else {
          disableAutoAnalyze();
        }

        vscode.window.showInformationMessage(
          `Auto-analysis on selection is now ${
            autoAnalyze ? "enabled" : "disabled"
          }.`
        );
      }
    })
  );

  // Add the status bar to context subscriptions
  context.subscriptions.push(statusBar);
}

function registerCommands(context: vscode.ExtensionContext) {
  // Register the command for manual analysis
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.analyzeFunction",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await analyzeFunction(editor);
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
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await generateUnitTest(editor);
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  // Register the command for generating frontend code
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.generateFrontendCode",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await generateFrontend(editor);
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  // Register context menu commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.contextAnalyze",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await analyzeFunction(editor);
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.contextGenerateUnitTest",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await generateUnitTest(editor);
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.contextGenerateFrontendCode",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await generateFrontend(editor);
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      }
    )
  );

  // Register the command for generating commit messages
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.generateCommitMessage",
      async () => {
        await generateCommitMessage();
      }
    )
  );

  // Register context menu command for generating commit messages
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-function-analysis.contextGenerateCommitMessage",
      async () => {
        await generateCommitMessage();
      }
    )
  );
}

// Debounce function to limit the rate of execution
function debounce(func: Function, wait: number) {
  return function (...args: any[]) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Function to analyze the selected code
async function analyzeFunction(editor: vscode.TextEditor) {
  const document = editor.document;
  let selection = editor.selection;

  // Expand selection to the full function if it's a single line
  selection = expandSelectionToFullFunction(document, selection);

  const code = editor.document.getText(selection);
  const fileName = editor.document.fileName;
  const languageId = editor.document.languageId;

  statusBar.text = "Code Analysis: Analyzing...";

  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const llmService = new LLMService(config);

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Analyzing function...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      try {
        const analysisResult = await llmService.analyzeCode(
          code,
          languageId,
          fileName
        );
        displayResults(analysisResult);
        statusBar.text = "Code Analysis: Complete";
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to analyze the selection. Please try again later."
        );
        statusBar.text = "Code Analysis: Failed";
      }

      progress.report({ increment: 100 });
    }
  );
}

// Function to generate unit tests for the selected code
async function generateUnitTest(editor: vscode.TextEditor) {
  const document = editor.document;
  let selection = editor.selection;

  // Expand selection to the full function if it's a single line
  selection = expandSelectionToFullFunction(document, selection);

  const code = editor.document.getText(selection);
  const fileName = editor.document.fileName;
  const languageId = editor.document.languageId;

  statusBar.text = "Unit Test Generation: Generating...";

  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const llmService = new LLMService(config);

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating unit test...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      try {
        const unitTestResult = await llmService.generateUnitTest(
          code,
          languageId,
          fileName
        );
        displayResults(unitTestResult);
        statusBar.text = "Unit Test Generation: Complete";
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to generate unit test. Please try again later."
        );
        statusBar.text = "Unit Test Generation: Failed";
      }

      progress.report({ increment: 100 });
    }
  );
}

// Function to generate frontend code based on the selected HTML code
async function generateFrontend(editor: vscode.TextEditor) {
  const document = editor.document;
  const selection = editor.selection;

  if (selection.isEmpty) {
    vscode.window.showErrorMessage("No code selected.");
    return;
  }

  const htmlCode = editor.document.getText(selection);

  statusBar.text = "Frontend Generation: Generating...";

  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const llmService = new LLMService(config);

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating frontend code...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      try {
        const frontendResult = await llmService.generateFrontendCode(htmlCode);
        displayResults(frontendResult);
        statusBar.text = "Frontend Generation: Complete";
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to generate frontend code. Please try again later."
        );
        statusBar.text = "Frontend Generation: Failed";
      }

      progress.report({ increment: 100 });
    }
  );
}

// Function to generate the commit message
async function generateCommitMessage() {
  statusBar.text = "Commit Message Generation: Generating...";

  const diff = await getGitDiff();
  if (!diff) {
    statusBar.text = "Commit Message Generation: No Staged Changes";
    return;
  }

  const config = vscode.workspace.getConfiguration("code-function-analysis");
  const llmService = new LLMService(config);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating commit message...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      try {
        const commitMessage = await llmService.generateCommitMessage(diff);

        // Display the commit message using displayResults with interactive buttons
        await displayCommitMessage(commitMessage);

        statusBar.text = "Commit Message Generation: Complete";
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to generate commit message. Please try again later."
        );
        statusBar.text = "Commit Message Generation: Failed";
      }

      progress.report({ increment: 100 });
    }
  );
}

// Function to display commit message and interact with the user
async function displayCommitMessage(commitMessage: string) {
  const options: DisplayResultsOptions = {
    title: "Generated Commit Message",
    enableScripts: true,
    additionalHtml: `
      <div>
        <button id="commitButton">Commit</button>
        <button id="editButton">Edit Message</button>
        <button id="cancelButton">Cancel</button>
      </div>
    `,
    additionalScripts: `
      const vscode = acquireVsCodeApi();

      document.getElementById('commitButton').addEventListener('click', () => {
        vscode.postMessage({ command: 'commit' });
      });

      document.getElementById('editButton').addEventListener('click', () => {
        vscode.postMessage({ command: 'edit' });
      });

      document.getElementById('cancelButton').addEventListener('click', () => {
        vscode.postMessage({ command: 'cancel' });
      });
    `,
    onDidReceiveMessage: async (message) => {
      if (message.command === "commit") {
        await commitChanges(commitMessage);
      } else if (message.command === "edit") {
        const editedMessage = await vscode.window.showInputBox({
          prompt: "Edit Commit Message",
          value: commitMessage,
        });
        if (editedMessage !== undefined) {
          await commitChanges(editedMessage);
        }
      } else if (message.command === "cancel") {
        vscode.window.showInformationMessage("Commit canceled.");
      }
    },
  };

  displayResults(`### Commit Message\n\n${commitMessage}`, options);
}

// Function to execute the git commit command
async function commitChanges(commitMessage: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;

  try {
    // Escape double quotes and backslashes in the commit message
    const sanitizedMessage = commitMessage
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    await execPromise(`git commit -m "${sanitizedMessage}"`, {
      cwd: workspacePath,
    });
    vscode.window.showInformationMessage("Changes committed successfully.");
  } catch (error: any) {
    vscode.window.showErrorMessage("Failed to commit changes.");
    console.error("Error committing changes:", error);
  }
}

// Function to get the git diff of staged changes
async function getGitDiff(): Promise<string | null> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return null;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;

  try {
    const { stdout, stderr } = await execPromise("git diff --cached", {
      cwd: workspacePath,
    });

    if (stderr) {
      console.error("Error getting git diff:", stderr);
      vscode.window.showErrorMessage("Error getting git diff.");
      return null;
    }

    if (!stdout) {
      vscode.window.showInformationMessage("No staged changes found.");
      return null;
    }

    return stdout;
  } catch (error) {
    console.error("Error executing git diff:", error);
    vscode.window.showErrorMessage("Error executing git diff.");
    return null;
  }
}

// Enable auto-analysis on selection
function enableAutoAnalyze(context: vscode.ExtensionContext) {
  if (selectionChangeSubscription) {
    selectionChangeSubscription.dispose();
  }

  selectionChangeSubscription = vscode.window.onDidChangeTextEditorSelection(
    debounce(async (event: vscode.TextEditorSelectionChangeEvent) => {
      const editor = event.textEditor;
      const selection = editor.selection;

      if (!selection.isEmpty) {
        await analyzeFunction(editor);
      }
    }, 1000)
  );

  context.subscriptions.push(selectionChangeSubscription);
}

// Disable auto-analysis on selection
function disableAutoAnalyze() {
  if (selectionChangeSubscription) {
    selectionChangeSubscription.dispose();
  }
}
