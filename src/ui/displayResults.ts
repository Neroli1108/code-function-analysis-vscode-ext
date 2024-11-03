// src/ui/displayResults.ts

import * as vscode from "vscode";
import { marked } from "marked";

export interface DisplayResultsOptions {
  viewType?: string;
  title?: string;
  enableScripts?: boolean;
  retainContextWhenHidden?: boolean;
  additionalHtml?: string;
  additionalScripts?: string;
  onDidReceiveMessage?: (message: any) => void;
}

export function displayResults(
  results: string,
  options?: DisplayResultsOptions
) {
  const panel = vscode.window.createWebviewPanel(
    options?.viewType || "functionAnalysis",
    options?.title || "Function Analysis",
    vscode.ViewColumn.Beside,
    {
      enableScripts: options?.enableScripts ?? true,
      retainContextWhenHidden: options?.retainContextWhenHidden ?? true,
    }
  );

  panel.webview.html = getWebviewContent(results, options);

  if (options?.onDidReceiveMessage) {
    panel.webview.onDidReceiveMessage(options.onDidReceiveMessage);
  }
}

function getWebviewContent(
  results: string,
  options?: DisplayResultsOptions
): string {
  const htmlContent = marked(results);
  const additionalHtml = options?.additionalHtml || "";
  const additionalScripts = options?.additionalScripts || "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${options?.title || "Analysis Results"}</title>
      <style>
        body { font-family: sans-serif; padding: 10px; }
        pre, code { background-color: #f3f3f3; padding: 10px; border-radius: 5px; overflow-x: auto; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        button { margin-right: 5px; padding: 5px 10px; }
      </style>
    </head>
    <body>
      ${htmlContent}
      ${additionalHtml}
      <script>
        ${additionalScripts}
      </script>
    </body>
    </html>
  `;
}
