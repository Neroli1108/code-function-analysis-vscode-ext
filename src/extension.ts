// src/extension.ts

import * as vscode from 'vscode';
import { analyzeCodeWithLLM } from './llmService';

let debounceTimeout: NodeJS.Timeout | undefined;
let lastSelectionText = '';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('code-function-analysis');
  const autoAnalyze = config.get('autoAnalyzeOnSelection') as boolean;

  if (autoAnalyze) {
    // Listen for selection changes with debouncing
    vscode.window.onDidChangeTextEditorSelection(
      debounce(async (event: vscode.TextEditorSelectionChangeEvent) => {
        const editor = event.textEditor;
        const selection = editor.selection;

        // Only trigger if there's a selection (non-empty)
        if (!selection.isEmpty) {
          await analyzeFunction(editor);
        }
      }, 1000) // Debounce delay in milliseconds
    );
  } else {
    // Register the command
    context.subscriptions.push(
      vscode.commands.registerCommand('code-function-analysis.analyzeFunction', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await analyzeFunction(editor);
        } else {
          vscode.window.showErrorMessage('No active editor found.');
        }
      })
    );
  }
}

export function deactivate() {}

function debounce(func: Function, wait: number) {
  return function (...args: any[]) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

async function analyzeFunction(editor: vscode.TextEditor) {
  const selection = editor.selection;
  const code = editor.document.getText(selection);

  // Avoid re-analyzing the same selection
  if (code === lastSelectionText) {
    return;
  }

  lastSelectionText = code;

  const languageId = editor.document.languageId;

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Analyzing function...',
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      // Analyze code with LLM
      const analysisResult = await analyzeCodeWithLLM(code, languageId);

      if (analysisResult) {
        // Display results
        displayResults(analysisResult);
      }

      progress.report({ increment: 100 });
    }
  );
}

function displayResults(results: string) {
  const panel = vscode.window.createWebviewPanel(
    'functionAnalysis',
    'Function Analysis',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  panel.webview.html = getWebviewContent(results);
}

function getWebviewContent(results: string): string {
  // Sanitize the results to prevent HTML injection
  const escapedResults = results
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Function Analysis</title>
      <style>
        body { font-family: sans-serif; padding: 10px; }
        pre { background-color: #f3f3f3; padding: 10px; border-radius: 5px; overflow-x: auto; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div>${escapedResults}</div>
    </body>
    </html>
  `;
}
