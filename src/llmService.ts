import { analyzeCodeWithLLM } from "./services/analyzeService";
import { generateFunctionUnitTest } from "./services/unitTestService";
import { generateFrontendTemplateWithLLM } from "./services/templateService";

// Exporting the functions so they can be easily used in the extension
export {
  analyzeCodeWithLLM,
  generateFunctionUnitTest,
  generateFrontendTemplateWithLLM,
};
