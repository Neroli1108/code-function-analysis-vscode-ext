# Changelog

All notable changes to this project will be documented in this file.

---

## [1.8.0] - 2024-10-15

### Added

- **Commit Message Generation**: Introduced the ability to generate commit messages based on your staged Git changes. The extension analyzes the diff of the staged changes and generates a concise and descriptive commit message using AI models (OpenAI, Hugging Face, and Google Gemini).

- **Integration with Existing UI**: The commit message feature is integrated with the existing `displayResults.ts` function, ensuring a consistent and seamless user experience across the extension.

- **Interactive Commit Message Editing**: Users can view the generated commit message in a webview panel with options to **Commit**, **Edit Message**, or **Cancel** directly within the panel.

- **Right-Click Context Menu**: Added the **"Generate Commit Message"** command to the editor's right-click context menu and the source control (`scm/title`) menu, allowing quick access to the commit message generation feature.

### Changed

- **Updated `displayResults.ts`**: Enhanced the `displayResults` function to support interactive content, enabling features like commit message confirmation and editing within the result display.

- **Updated `package.json`**: Modified the extension's configuration to include the new command in the context menus and updated the activation events accordingly.

- **README Update**: Updated the README to version **1.8.0**, reflecting the new commit message generation feature and instructions on how to use it.

### Fixed

- **Sanitization and Security Enhancements**: Improved input sanitization when handling commit messages and user inputs to prevent injection attacks and ensure secure execution of Git commands.

- **Minor Bug Fixes**: Addressed minor issues related to command registration and context menu integration.

---

## [1.7.1] - 2024-10-14

### Added

- **HTML Frontend Code Generation**: Introduced the ability to generate frontend code (CSS and JavaScript) from selected HTML code using AI models (OpenAI, Hugging Face, and Google Gemini).

- **Right-Click Context Menu**: Added a new context menu option to generate frontend code from selected HTML snippets.

### In Progress

- **Image Screenshot Frontend Code Generation**: Working on the feature to generate frontend code based on image screenshots, allowing the extension to build out page layouts visually.

- **Code Refactor**: Ongoing code refactor to improve maintainability and enhance extension performance.

### Changed

- **Selection Behavior Refinement**: Improved handling of code selection and configuration changes, enabling automatic function analysis without the need to reload the extension.

- **README Update**: Updated the README to reflect the new HTML frontend code generation feature.

---

## [1.6.0] - 2024-10-09

### Added

- **Unit Test Generation**: Introduced the ability to generate unit tests for selected functions using AI models (OpenAI, Hugging Face, and Google Gemini).

- **Custom Hugging Face Model Support**: Users can now specify custom Hugging Face models for unit test generation and function analysis.

- **Retry Logic**: Implemented improved retry mechanisms for both function analysis and unit test generation if the initial request fails.

- **Status Bar Integration**: Real-time status bar updates during unit test generation (e.g., "Generating...", "Complete", "Retrying...").

- **Right-Click Context Menu**: Added new commands to the right-click menu for both function analysis and unit test generation.

### Changed

- **Enhanced Progress Indicators**: Refined the progress bar behavior during function analysis and unit test generation for a better user experience.

- **README Update**: Updated the README to include the new unit test generation feature and custom model support.

### Fixed

- **Model Availability Handling**: Addressed an issue where the analysis could fail if models were temporarily unavailable or loading, adding better handling for such scenarios.

---

## [1.5.0] - 2024-09-15

### Added

- **Google Gemini Model Support**: Added support for analyzing functions with Google’s Gemini AI models.

- **Model Loading Handling**: Improved handling of model loading times on Hugging Face and Google Gemini, including retries and informative status updates.

- **Enhanced Webview for Results**: Improved the webview panel that displays function analysis results, with better formatting and styling for readability.

### Changed

- **Prompt Refinement**: Updated the function analysis prompt for better feedback, especially when the `"verbose"` mode is enabled.

- **Debounce Logic Improvement**: Refined the debounce logic for automatic function analysis to reduce unnecessary requests and enhance performance.

---

## [1.4.0] - 2024-08-20

### Added

- **Hugging Face Model Support**: Integrated Hugging Face models (such as `EleutherAI/gpt-neo-2.7B`) for function analysis, providing a free alternative to OpenAI's models.

- **Automatic Function Analysis**: Added the option to automatically analyze code when it is selected, with a configurable debounce delay to prevent excessive requests.

- **Progress Indicator**: Implemented progress indicators during function analysis, showing the current state (e.g., "Analyzing...").

### Changed

- **Error Handling Improvement**: Enhanced error handling for situations where the OpenAI API key is not set or invalid.

---

## [1.3.0] - 2024-07-10

### Added

- **OpenAI GPT-4 Support**: Added integration with OpenAI's GPT-4 for code function analysis, providing advanced feedback on performance, style, and complexity.

- **Feedback Modes**: Introduced simple and verbose feedback modes, allowing users to tailor the level of detail in the analysis to their preferences.

---

## [1.2.0] - 2024-06-01

### Added

- **Initial Release**: Launched the first version of the Code Function Analysis extension, featuring function analysis for Python, JavaScript, and TypeScript using OpenAI’s GPT-4.

---

### Notes

- Versions follow semantic versioning guidelines: `Major.Minor.Patch`.
- For detailed installation and usage instructions, refer to the README.

---
