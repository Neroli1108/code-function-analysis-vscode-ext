# Changelog

All notable changes to this project will be documented in this file.

## [1.7.1] - 2024-10-14

### Added

- **HTML Frontend Code Generation**: Introduced the ability to generate frontend code templates (HTML, CSS, JavaScript) from selected HTML code using AI models (OpenAI, Hugging Face, and Google Gemini).
- **Right-Click Context Menu**: Added a new context menu option to generate frontend code from selected HTML.

### In Progress

- **Image Screenshot Frontend Code Generation**: Working on the feature to generate frontend code based on an image screenshot, allowing the extension to build out page layouts visually.
- **Code Refactor**: Ongoing code refactor to improve maintainability and enhance extension performance.

### Changed

- Refined the selection behavior and improved handling of configuration changes for automatic function analysis without reloading the extension.
- Updated the README to reflect the new HTML frontend code generation feature.

---

## [1.6.0] - 2024-10-09

### Added

- **Unit Test Generation**: Introduced the ability to generate unit tests for selected functions using AI models (OpenAI, Hugging Face, and Google Gemini).
- **Custom Hugging Face Model Support**: Users can now specify custom Hugging Face models for unit test generation and function analysis.
- **Retry Logic**: Improved retry mechanism for both function analysis and unit test generation if the initial request fails.
- **Status Bar Integration**: Real-time status bar updates during unit test generation (e.g., "Generating...", "Complete", "Retrying...").
- **Right-Click Context Menu**: Added new commands to the right-click menu for both function analysis and unit test generation.

### Changed

- Updated the README to reflect the new unit test generation feature and custom model support.
- Refined the progress bar behavior during function analysis and unit test generation for better UX.

### Fixed

- Addressed an issue where the analysis could fail if models were temporarily unavailable or loading.

---

## [1.5.0] - 2024-09-15

### Added

- **Google Gemini Model Support**: Added support for analyzing functions with Google’s Gemini AI models.
- **Model Loading Handling**: Improved handling of model loading times on Hugging Face and Google Gemini, including retries.
- **Enhanced Webview for Results**: Improved the webview panel that displays function analysis, with better formatting for readability.

### Changed

- Updated the function analysis prompt for better feedback, especially when the `"verbose"` mode is enabled.
- Refined the debounce logic for automatic function analysis to reduce unnecessary requests.

---

## [1.4.0] - 2024-08-20

### Added

- **Hugging Face Model Support**: Integrated free Hugging Face models (such as EleutherAI/gpt-neo-2.7B) for function analysis.
- **Automatic Function Analysis**: Automatically analyze code when it is selected, with a configurable debounce delay.
- **Progress Indicator**: Added progress indicators during function analysis, showing the current state (e.g., "Analyzing...").

### Changed

- Improved error handling for OpenAI API key configuration issues.

### Fixed

- Fixed an issue where the extension would fail to activate when opening certain language files.

---

## [1.3.0] - 2024-07-10

### Added

- **OpenAI GPT-4 Support**: Added integration with OpenAI's GPT-4 for code function analysis, providing feedback on performance, style, and complexity.
- **Simple and Verbose Feedback Modes**: Users can now choose between simple and verbose feedback modes to tailor the analysis to their preferences.

---

## [1.2.0] - 2024-06-01

### Added

- **Initial Release**: The first version of the Code Function Analysis extension, featuring function analysis for Python, JavaScript, and TypeScript using OpenAI’s GPT-4.

---

### Notes:

- Versions follow semantic versioning guidelines: `Major.Minor.Patch`.
- For detailed installation and usage instructions, refer to the README.

---
