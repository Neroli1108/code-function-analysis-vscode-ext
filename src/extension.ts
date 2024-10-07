import * as vscode from 'vscode';
import { analyzeCodeWithLLM } from './llmService';
import { marked } from 'marked';
import { expandSelectionToFullFunction } from './functionCapture';


let debounceTimeout: NodeJS.Timeout | undefined;
let statusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('code-function-analysis');
  const autoAnalyze = config.get('autoAnalyzeOnSelection') as boolean;

  // Initialize status bar item
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.text = 'Code Analysis: Ready';
  statusBar.show();

  // Handle auto-analysis on selection
  if (autoAnalyze) {
    context.subscriptions.push(
      vscode.window.onDidChangeTextEditorSelection(
        debounce(async (event: vscode.TextEditorSelectionChangeEvent) => {
          const editor = event.textEditor;
          const selection = editor.selection;

          if (!selection.isEmpty) {
            await analyzeFunction(editor);
          }
        }, 1000) // 1-second debounce delay
      )
    );
  } 

  // Register the command for manual analysis
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

  // Register right-click context menu command
  context.subscriptions.push(
    vscode.commands.registerCommand('code-function-analysis.contextAnalyze', async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        await analyzeFunction(editor);
      } else {
        vscode.window.showErrorMessage('No active editor found.');
      }
    })
  );

  // Add the status bar and commands to context subscriptions
  context.subscriptions.push(statusBar);
}

export function deactivate() {}

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

async function analyzeFunction(editor: vscode.TextEditor) {

  const document = editor.document;
  let selection = editor.selection;
  
	// Expand selection to the full function if it's a single line
  selection = expandSelectionToFullFunction(document, selection);
  
  const code = editor.document.getText(selection);
  const fileName = editor.document.fileName;
  const languageId = editor.document.languageId;

  // Allow re-analysis of the same selection by removing any cache restrictions
  statusBar.text = 'Code Analysis: Analyzing...';

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Analyzing function...',
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0 });

      let analysisResult: string | null = null;

      try {
        // Analyze code with LLM
        analysisResult = await analyzeCodeWithLLM(code, languageId, fileName);
      } catch (error) {
        // Retry once if analysis fails
        statusBar.text = 'Code Analysis: Retry...';
        try {
          analysisResult = await analyzeCodeWithLLM(code, languageId, fileName);
        } catch (retryError) {
          vscode.window.showErrorMessage('Failed to analyze the selection. Please try again later.');
          statusBar.text = 'Code Analysis: Failed';
        }
      }

      if (analysisResult) {
        // Display results
        displayResults(analysisResult);
        statusBar.text = 'Code Analysis: Complete';
      } else {
        statusBar.text = 'Code Analysis: Failed';
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
  // Convert markdown to HTML
  const htmlContent = marked(results);

  // Construct the full HTML for the webview
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
      ${htmlContent}
    </body>
    </html>
  `;
}

// function displayResults(results: string) {
//   const panel = vscode.window.createWebviewPanel(
//     'functionAnalysis',
//     'Function Analysis',
//     vscode.ViewColumn.Beside,
//     {
//       enableScripts: true,
//       retainContextWhenHidden: true,
//     }
//   );
  
//   panel.webview.html = getWebviewContent(results);
// }

// function getWebviewContent(results: string): string {
//   // Sanitize the results to prevent HTML injection
//   const escapedResults = results
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/\n/g, '<br>');

//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <title>Function Analysis</title>
//       <style>
//         body { font-family: sans-serif; padding: 10px; }
//         pre { background-color: #f3f3f3; padding: 10px; border-radius: 5px; overflow-x: auto; }
//         a { color: #0066cc; text-decoration: none; }
//         a:hover { text-decoration: underline; }
//       </style>
//     </head>
//     <body>
//       <div>${escapedResults}</div>
//     </body>
//     </html>
//   `;
// }
