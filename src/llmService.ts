// src/llmService.ts

import axios from 'axios';
import * as vscode from 'vscode';

export async function analyzeCodeWithLLM(code: string, languageId: string): Promise<string> {
  // Get the OpenAI API key from settings
  const apiKey = vscode.workspace.getConfiguration('code-function-analysis').get('apiKey') as string;

  if (!apiKey) {
    vscode.window.showErrorMessage('OpenAI API key is not set. Please set it in the extension settings.');
    return '';
  }

  // Get user settings
  const feedbackLevel = vscode.workspace
    .getConfiguration('code-function-analysis')
    .get('feedbackLevel') as string || 'simple';
  const focusAreas = vscode.workspace
    .getConfiguration('code-function-analysis')
    .get('focusAreas') as string[] || ['performance', 'style', 'readability'];

  // Prepare the prompt
  let styleGuide = '';

  switch (languageId) {
    case 'python':
      styleGuide = 'PEP 8';
      break;
    case 'javascript':
      styleGuide = 'Airbnb JavaScript Style Guide';
      break;
    case 'java':
      styleGuide = 'Google Java Style Guide';
      break;
    case 'cpp':
      styleGuide = 'C++ Core Guidelines';
      break;
    default:
      styleGuide = 'standard conventions';
      break;
  }

  const focusAreasText = focusAreas.join(', ');

  const prompt = `You are a code review assistant. Analyze the following ${languageId} function according to ${styleGuide} and focus on ${focusAreasText}. Provide ${feedbackLevel} feedback with suggestions for improvement. Include links to relevant documentation or examples where appropriate.

Code:
${code}
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    if (error.response) {
      // The request was made, and the server responded with a status code outside the 2xx range
      console.error('API Response Error:', error.response.data);
      const status = error.response.status;
      const statusText = error.response.statusText;
      const errorData = error.response.data;

      // Display a detailed error message to the user
      let errorMessage = `OpenAI API error: ${status} ${statusText}`;
      if (errorData && errorData.error && errorData.error.message) {
        errorMessage += `\nDetails: ${errorData.error.message}`;
      }

      vscode.window.showErrorMessage(errorMessage);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No response received:', error.request);
      vscode.window.showErrorMessage('No response received from OpenAI API. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error in API request:', error.message);
      vscode.window.showErrorMessage(`Error in API request: ${error.message}`);
    }
    return '';
  }
}
