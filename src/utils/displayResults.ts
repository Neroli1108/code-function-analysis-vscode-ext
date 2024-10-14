import * as vscode from "vscode";
import { marked } from "marked";

export function displayResults(
  results: string,
  title: string = "Analysis Results"
) {
  const panel = vscode.window.createWebviewPanel(
    "functionAnalysis",
    title,
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  panel.webview.html = getWebviewContent(results);
}

function getWebviewContent(results: string): string {
  const htmlContent = marked(results);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Analysis Results</title>
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
