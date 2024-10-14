import * as vscode from "vscode";
// Centralized error handling function
export function handleApiError(error: any, providerName: string) {
  if (error.response) {
    console.error(`${providerName} API Response Error:`, error.response.data);
    vscode.window.showErrorMessage(
      `${providerName} API error: ${error.response.status} ${error.response.statusText}`
    );
  } else if (error.request) {
    console.error(
      `No response received from ${providerName} API:`,
      error.request
    );
    vscode.window.showErrorMessage(
      `No response received from ${providerName} API. Check your network connection.`
    );
  } else {
    console.error(`Error in ${providerName} API request:`, error.message);
    vscode.window.showErrorMessage(
      `Error in ${providerName} API request: ${error.message}`
    );
  }
}
