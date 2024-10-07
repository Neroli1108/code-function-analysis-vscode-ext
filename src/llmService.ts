import axios from 'axios';
import * as vscode from 'vscode';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeCodeWithLLM(code: string, languageId: string, fileName: string): Promise<string> {
  const config = vscode.workspace.getConfiguration('code-function-analysis');
  const provider = config.get('apiProvider') as string || 'HuggingFace';
  let result = '';

  switch (provider) {
    case 'OpenAI':
      result = await analyzeWithOpenAI(code, languageId, fileName, config);
      break;
    case 'HuggingFace':
      result = await analyzeWithHuggingFace(code, languageId, fileName, config);
      break;
    case 'GoogleGemini':
      result = await analyzeWithGoogleGemini(code, languageId, fileName, config);
      break;
    default:
      vscode.window.showErrorMessage('Invalid API provider selected.');
      return '';
  }

  return result;
}

async function analyzeWithOpenAI(code: string, languageId: string, fileName: string, config: vscode.WorkspaceConfiguration): Promise<string> {
  const apiKey = config.get('openAIApiKey') as string;

  if (!apiKey) {
    vscode.window.showErrorMessage('OpenAI API key is not set. Please set it in the extension settings.');
    return '';
  }

  const prompt = buildPrompt(code, languageId, fileName, config);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
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

async function analyzeWithHuggingFace(code: string, languageId: string, fileName: string, config: vscode.WorkspaceConfiguration): Promise<string> {
  const apiKey = config.get('huggingFaceApiKey') as string;
  const model = config.get('huggingFaceModel') as string || 'EleutherAI/gpt-neo-2.7B';

  if (!apiKey) {
    vscode.window.showErrorMessage('Hugging Face API key is not set. Please set it in the extension settings.');
    return '';
  }

  const prompt = buildPrompt(code, languageId, fileName, config);

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 700,
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

// ToDo: Add Google Gemini 
async function analyzeWithGoogleGemini(code: string, languageId: string, fileName: string, config: vscode.WorkspaceConfiguration): Promise<string> {
  const apiKey = config.get('googleGeminiApiKey') as string;
  const model_name = config.get('googleGeminiModel') as string || 'gemini-1.5-flash';

  if (!apiKey) {
    vscode.window.showErrorMessage('Google Gemini API key is not set. Please set it in the extension settings.');
    return '';
  }

  const prompt = buildPrompt(code, languageId, fileName, config);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: model_name });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    handleApiError(error, 'Google Gemini');
    return '';
  }
}

function buildPrompt(code: string, languageId: string, fileName: string, config: vscode.WorkspaceConfiguration): string {
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

  let feedbackInstruction = feedbackLevel === 'verbose'
    ? `Provide detailed feedback with pros and cons of each suggestion. If there are mistakes in the code, highlight them, correct the code, and explain why the changes improve it. Act like a mentor, guiding the user to write better code.`
    : `Provide concise feedback. If there are mistakes in the code, highlight them, provide corrections, and explain why the changes improve the code.`;

  return `You are a code review assistant. Analyze the following ${languageId} function from the file ${fileName} according to ${styleGuide} and focus on ${focusAreasText}. If the code contains errors or areas of improvement, highlight those issues, provide corrected code, and explain why the changes improve the code, like a mentor helping a student. Include an analysis of the function's time and space complexity where applicable.

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
