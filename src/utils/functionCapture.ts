import * as vscode from 'vscode';

/**
 * Expands the selection to cover the whole function if only a single line is selected.
 * Handles mainstream languages such as Python, JavaScript, TypeScript, Java, C++.
 */
export function expandSelectionToFullFunction(
  document: vscode.TextDocument,
  selection: vscode.Selection
): vscode.Selection {
    
// Read the user's configuration for expanding selection
const config = vscode.workspace.getConfiguration('code-function-analysis');
const expandSelection = config.get('expandSelectionToFunction', true); // Default to true

// If the setting is false, return the original selection
if (!expandSelection) {
  return selection;
}


  const languageId = document.languageId;
  switch (languageId) {
    case 'python':
      return expandForPython(document, selection);
    case 'javascript':
    case 'typescript':
    case 'java':
    case 'cpp':
      return expandForCurlyBraceLanguages(document, selection);
    default:
      // Default behavior: return the original selection if the language is unsupported
      return selection;
  }
}

// Expand selection for Python
function expandForPython(
  document: vscode.TextDocument,
  selection: vscode.Selection
): vscode.Selection {
  let startLine = selection.start.line;
  let endLine = selection.end.line;

  // Move the startLine up to find the function or class definition
  while (startLine > 0) {
    const lineText = document.lineAt(startLine).text.trim();
    if (lineText.startsWith('def ') || lineText.startsWith('class ')) {
      break;
    }
    startLine--;
  }

  // Move the endLine down to include the full function body based on indentation
  const baseIndentation = document.lineAt(startLine).firstNonWhitespaceCharacterIndex;
  while (endLine < document.lineCount - 1) {
    endLine++;
    const lineText = document.lineAt(endLine).text.trim();
    if (
      lineText && 
      document.lineAt(endLine).firstNonWhitespaceCharacterIndex <= baseIndentation
    ) {
      endLine--; // Step back to the previous line since we are out of function scope
      break;
    }
  }

  // Return the expanded selection
  return new vscode.Selection(
    document.lineAt(startLine).range.start,
    document.lineAt(endLine).range.end
  );
}

// Expand selection for JavaScript, TypeScript, Java, C++
function expandForCurlyBraceLanguages(
  document: vscode.TextDocument,
  selection: vscode.Selection
): vscode.Selection {
  let startLine = selection.start.line;
  let endLine = selection.end.line;

  // Move startLine up to find the function or method declaration
  while (startLine > 0) {
    const lineText = document.lineAt(startLine).text.trim();
    if (isFunctionStart(lineText, document.languageId)) {
      break;
    }
    startLine--;
  }

  // Find the matching curly braces to determine the end of the function
  let openBraces = 0;
  let closeBraces = 0;
  let foundStart = false;

  for (let i = startLine; i < document.lineCount; i++) {
    const lineText = document.lineAt(i).text;
    for (const char of lineText) {
      if (char === '{') {
        openBraces++;
        foundStart = true;
      } else if (char === '}') {
        closeBraces++;
      }

      if (foundStart && openBraces === closeBraces) {
        endLine = i;
        break;
      }
    }

    if (foundStart && openBraces === closeBraces) {
      break;
    }
  }

  // Return the expanded selection
  return new vscode.Selection(
    document.lineAt(startLine).range.start,
    document.lineAt(endLine).range.end
  );
}

// Check if the line is a function or method start for JS, TS, Java, or C++
function isFunctionStart(lineText: string, languageId: string): boolean {
    // Remove comments and whitespace for better matching
    lineText = lineText.trim().replace(/\/\/.*|\/\*.*\*\//g, '');
  
    if (languageId === 'javascript' || languageId === 'typescript') {
      return (
        lineText.startsWith('function ') ||
        lineText.includes('=>') ||
        !!lineText.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*\s*\(.*\)\s*{/)
      );
    }
  
    if (languageId === 'java' || languageId === 'cpp') {
      return !!lineText.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*\s+[a-zA-Z_$][0-9a-zA-Z_$]*\s*\(.*\)\s*{/);
    }
  
    return false;
  }