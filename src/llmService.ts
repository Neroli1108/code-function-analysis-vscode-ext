// src/llmService.ts

import axios from 'axios';
import * as vscode from 'vscode';

export async function analyzeCodeWithLLM(code: string, languageId: string): Promise<string> {
  const config = vscode.workspace.getConfiguration('code-function-analysis');
  const provider = config.get('apiProvider') as string || 'HuggingFace';

  switch (provider) {
    case 'OpenAI':
      return analyzeWithOpenAI(code, languageId, config);
    case 'HuggingFace':
      return analyzeWithHuggingFace(code, languageId, config);
    default:
      vscode.window.showErrorMessage('Invalid API provider selected.');
      return '';
  }
}

async function analyzeWithOpenAI(code: string, languageId: string, config: vscode.WorkspaceConfiguration): Promise<string> {
  const apiKey = config.get('openAIApiKey') as string;

  if (!apiKey) {
    vscode.window.showErrorMessage('OpenAI API key is not set. Please set it in the extension settings.');
    return '';
  }

  const prompt = buildPrompt(code, languageId, config);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // or 'gpt-3.5-turbo' if you don't have access to GPT-4
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
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
    handleApiError(error, 'OpenAI');
    return '';
  }
}

async function analyzeWithHuggingFace(code: string, languageId: string, config: vscode.WorkspaceConfiguration): Promise<string> {
  const apiKey = config.get('huggingFaceApiKey') as string;

  if (!apiKey) {
    vscode.window.showErrorMessage('Hugging Face API key is not set. Please set it in the extension settings.');
    return '';
  }

  const prompt = buildPrompt(code, languageId, config);

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (response.data && response.data.generated_text) {
      return response.data.generated_text.trim();
    } else if (Array.isArray(response.data)) {
      return response.data[0].generated_text.trim();
    } else {
      vscode.window.showErrorMessage('Unexpected response format from Hugging Face API.');
      console.error('Response:', response.data);
      return '';
    }
  } catch (error: any) {
    handleApiError(error, 'Hugging Face');
    return '';
  }
}

function buildPrompt(code: string, languageId: string, config: vscode.WorkspaceConfiguration): string {
  const feedbackLevel = config.get('feedbackLevel') as string || 'simple';
  const focusAreas = config.get('focusAreas') as string[] || ['performance', 'style', 'readability', 'complexity'];

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

  // Adjust the prompt based on feedback level
  let feedbackInstruction = '';
  if (feedbackLevel === 'verbose') {
    feedbackInstruction = 'Provide detailed feedback with pros and cons of each suggestion.';
  } else {
    feedbackInstruction = 'Provide concise feedback.';
  }

  return `You are a code review assistant. Analyze the following ${languageId} function according to ${styleGuide} and focus on ${focusAreasText}. If the code is not good or elegant, provide suggestions for improvement. ${feedbackInstruction} Include an analysis of the function's time and space complexity. Include links to relevant documentation or examples where appropriate.

Code:
${code}
`;
}

function handleApiError(error: any, providerName: string) {
  if (error.response) {
    console.error(`${providerName} API Response Error:`, error.response.data);
    const status = error.response.status;
    const statusText = error.response.statusText;
    const errorData = error.response.data;

    let errorMessage = `${providerName} API error: ${status} ${statusText}`;
    if (errorData && (errorData.error || errorData.message)) {
      errorMessage += `\nDetails: ${errorData.error || errorData.message}`;
    }

    vscode.window.showErrorMessage(errorMessage);
  } else if (error.request) {
    console.error(`No response received from ${providerName} API:`, error.request);
    vscode.window.showErrorMessage(`No response received from ${providerName} API. Please check your network connection.`);
  } else {
    console.error(`Error in ${providerName} API request:`, error.message);
    vscode.window.showErrorMessage(`Error in ${providerName} API request: ${error.message}`);
  }
}
