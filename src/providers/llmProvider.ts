// src/providers/llmProvider.ts

export interface LLMProvider {
  analyzeCode(
    code: string,
    languageId: string,
    fileName: string
  ): Promise<string>;
  generateUnitTest(
    code: string,
    languageId: string,
    fileName: string
  ): Promise<string>;
  generateFrontendCode(htmlCode: string): Promise<string>;
  generateCommitMessage(diff: string): Promise<string>;
}
