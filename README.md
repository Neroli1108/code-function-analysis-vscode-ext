# Code Function Analysis Extension

**Version:** 1.8.0  
**Author:** Nero

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Setting Up the OpenAI, Hugging Face, or Google Gemini API Key](#setting-up-the-openai-hugging-face-or-google-gemini-api-key)
  - [Configuring Extension Settings](#configuring-extension-settings)
- [Usage](#usage)
  - [Analyzing a Function](#analyzing-a-function)
  - [Generating Unit Tests](#generating-unit-tests)
  - [Generating Frontend Code](#generating-frontend-code)
  - [Generating Commit Messages](#generating-commit-messages)
- [Commands](#commands)
- [Extension Settings](#extension-settings)
- [Development](#development)
  - [Building the Extension](#building-the-extension)
  - [Running the Extension](#running-the-extension)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Introduction

**Code Function Analysis** is a Visual Studio Code extension that provides intelligent, context-aware analysis of your code. Leveraging advanced AI through OpenAI's GPT-4, models from Hugging Face, and Google's Gemini AI, this tool offers comprehensive feedback on various aspects of your code, including:

- **Performance optimization**
- **Naming conventions**
- **Code quality**
- **Opportunities for improvement**
- **Unit Test Generation**: Generate unit tests for selected functions using AI models
- **Frontend Code Generation**: Automatically generate CSS and JavaScript code from selected HTML snippets
- **Commit Message Generation**: Automatically generate commit messages based on your staged Git changes

Transform your coding experience with mentor-like suggestions and best practices to enhance your code's readability, maintainability, and efficiency.

---

## Features

- **Big O Complexity Analysis**: Understand the time and space complexity of your functions.
- **Variable Naming and Style Checks**: Ensure compliance with language-specific style guides (e.g., PEP 8 for Python).
- **Code Elegance Evaluation**: Receive suggestions to make your code more concise and readable.
- **Mentor-Like Feedback**: Get constructive advice with clear explanations for each recommendation.
- **Interactive Learning**: Access relevant documentation and examples for further learning.
- **Feedback Customization**: Tailor the analysis focus and feedback level to your preferences.
- **Multi-Language Support**: Supports Python, JavaScript, Java, C++, HTML, and more.
- **Automatic Selection Analysis**: Automatically analyze selected code with debouncing to prevent excessive requests.
- **Retry Logic for Analysis Requests**: Automatically retries analysis if the initial request fails, with enhanced handling for models that are loading.
- **Unit Test Generation**: Automatically generate unit tests for selected functions.
- **Frontend Code Generation**: Generate CSS and JavaScript code from selected HTML snippets to enhance functionality and appearance.
- **Commit Message Generation**: Generate concise and descriptive commit messages based on your staged Git changes.
- **Status Bar Updates**: Real-time status updates during code analysis, unit test generation, frontend code generation, and commit message generation.
- **Supports Multiple AI Models**:
  - **OpenAI Models**: Use GPT-4 for sophisticated analysis and generation tasks.
  - **Hugging Face Models**: Access a variety of models, including `nvidia/NVLM-D-72B`.
  - **Google Gemini Models**: Choose from different variants like Gemini 1.5 Flash, Flash-8B, Pro, and Gemini 1.0 Pro for AI analysis and generation.
- **Custom Model Support**: Ability to specify any Hugging Face model by entering the model name in the extension settings.

---

## Installation

### From the VS Code Marketplace

[Install Code Function Analysis](https://marketplace.visualstudio.com/items?itemName=Nero375.code-function-analysis)

### Manual Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Neroli1108/code-function-analysis-vscode-ext.git
   ```

2. **Navigate to the Extension Directory**:

   ```bash
   cd code-function-analysis-vscode-ext
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Build the Extension**:

   ```bash
   npm run compile
   ```

5. **Install the Extension in VS Code**:

   - Open Visual Studio Code.
   - Go to `Extensions` (`Ctrl+Shift+X` or `Cmd+Shift+X`).
   - Click on the `...` menu and select `Install from VSIX...`.
   - Navigate to the `code-function-analysis-vscode-ext` directory and select the generated `.vsix` file.

---

## Requirements

- **Visual Studio Code** version `1.94.0` or higher.
- **Node.js** version `14.x` or higher.
- An **API Key** for OpenAI, Hugging Face, or Google Gemini, depending on the models you want to use.
- **Git** must be installed and accessible in your system's PATH for commit message generation.

---

## Getting Started

### Setting Up the OpenAI, Hugging Face, or Google Gemini API Key

1. **Obtain an API Key**:

   - For **OpenAI**: Sign up or log in to the [OpenAI Platform](https://platform.openai.com/), navigate to the API keys section, and generate a new secret key.
   - For **Hugging Face**: Sign up or log in to the [Hugging Face Platform](https://huggingface.co/), and navigate to your account settings to generate an API key.
   - For **Google Gemini**: Follow the setup instructions to obtain your Gemini AI API key (visit [Google AI Platform](https://ai.google.com/) for more information).

2. **Configure the API Key in VS Code**:

   - Open Visual Studio Code.
   - Go to `File` > `Preferences` > `Settings` (or `Code` > `Preferences` > `Settings` on macOS).
   - Search for `Code Function Analysis`.
   - Enter your API key in the appropriate field for the AI service you wish to use (OpenAI, Hugging Face, or Google Gemini).

   **Note**: Keep your API key secure and do not share it publicly.

### Configuring Extension Settings

- **API Provider**:

  - Choose between `"OpenAI"`, `"HuggingFace"`, or `"GoogleGemini"` for analysis and generation tasks.

- **Hugging Face Model Selection**:

  - Choose from the pre-defined models or set `"custom"` and specify your desired model name.

- **Feedback Level**:

  - Choose between `"simple"` or `"verbose"` feedback.

- **Focus Areas**:

  - Select the focus areas for analysis: `performance`, `style`, `readability`, `complexity`.

- **Automatic Analysis**:

  - Enable or disable automatic analysis when code is selected.

---

## Usage

### Analyzing a Function

1. **Open a Code File**:

   - Open a code file in a supported language (e.g., Python, JavaScript).

2. **Select a Function**:

   - Highlight the function code you want to analyze.

3. **Run the Analysis Command**:

   - Right-click and select **"Analyze Selected Function"** from the context menu.
   - Or open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS), type `Analyze Selected Function`, and select the command.

4. **View the Analysis**:

   - A new panel will display the analysis, including suggestions and improvements.

5. **Status Bar**:

   - The status bar at the bottom left will display real-time updates, such as "Analyzing...", "Complete", or "Retrying..." when applicable.

### Generating Unit Tests

1. **Open a Code File**:

   - Open a code file in a supported language.

2. **Select a Function**:

   - Highlight the function code you want to generate unit tests for.

3. **Run the Generate Unit Test Command**:

   - Right-click and select **"Generate Unit Test for Selected Function"** from the context menu.
   - Or open the Command Palette, type `Generate Unit Test for Selected Function`, and select the command.

4. **View the Generated Unit Tests**:

   - A new panel will display the generated unit tests, including test cases and edge cases where applicable.

### Generating Frontend Code

1. **Open an HTML File**:

   - Open an HTML file containing the code you want to enhance.

2. **Select an HTML Snippet**:

   - Highlight the HTML code for which you want to generate CSS and JavaScript.

3. **Run the Generate Frontend Code Command**:

   - Right-click and select **"Generate Frontend Code from HTML"** from the context menu.
   - Or open the Command Palette, type `Generate Frontend Code from HTML`, and select the command.

4. **View the Generated Code**:

   - A new panel will display the generated CSS and JavaScript code to enhance the functionality and appearance of your HTML snippet.

### Generating Commit Messages

1. **Stage Your Changes**:

   - Use Git to stage the changes you want to commit.

2. **Run the Generate Commit Message Command**:

   - Right-click in the editor and select **"Generate Commit Message"** from the context menu.
   - Or open the Command Palette, type `Generate Commit Message`, and select the command.

3. **View and Confirm the Commit Message**:

   - A new panel will display the generated commit message.
   - You can choose to **Commit**, **Edit Message**, or **Cancel**.

4. **Commit the Changes**:

   - If you choose **Commit**, the extension will commit the staged changes using the generated message.
   - If you choose **Edit Message**, you can modify the message before committing.

5. **Status Bar**:

   - The status bar will display updates like "Generating...", "Complete", or "Failed" during the process.

**Note**: Ensure that Git is installed and properly configured in your system for this feature to work.

---

## Commands

- **Analyze Selected Function**:

  - **Command ID**: `code-function-analysis.analyzeFunction`
  - **Description**: Analyzes the selected code function and provides feedback.

- **Generate Unit Test for Selected Function**:

  - **Command ID**: `code-function-analysis.generateUnitTest`
  - **Description**: Generates unit tests for the selected function using AI models.

- **Generate Frontend Code from HTML**:

  - **Command ID**: `code-function-analysis.generateFrontendCode`
  - **Description**: Generates CSS and JavaScript code from selected HTML snippets.

- **Generate Commit Message**:

  - **Command ID**: `code-function-analysis.generateCommitMessage`
  - **Description**: Generates a commit message based on your staged Git changes.

---

## Extension Settings

- **`code-function-analysis.apiProvider`**:

  - **Type**: `string`
  - **Options**: `"OpenAI"`, `"HuggingFace"`, `"GoogleGemini"`
  - **Description**: Select the AI service provider for code analysis and generation tasks.
  - **Default**: `"GoogleGemini"`

- **`code-function-analysis.openAIApiKey`**:

  - **Type**: `string`
  - **Description**: Your OpenAI API key.
  - **Default**: `""` (empty string)

- **`code-function-analysis.huggingFaceApiKey`**:

  - **Type**: `string`
  - **Description**: Your Hugging Face API key.
  - **Default**: `""` (empty string)

- **`code-function-analysis.huggingFaceModel`**:

  - **Type**: `string`
  - **Options**: Predefined models or `"custom"`
  - **Description**: Select a predefined Hugging Face model or set `"custom"` to use your own model.
  - **Default**: `"EleutherAI/gpt-neo-2.7B"`

- **`code-function-analysis.huggingFaceCustomModel`**:

  - **Type**: `string`
  - **Description**: Specify a custom Hugging Face model name if `"custom"` is selected.
  - **Default**: `""` (empty string)

- **`code-function-analysis.googleGeminiApiKey`**:

  - **Type**: `string`
  - **Description**: Your Google Gemini API key.
  - **Default**: `""` (empty string)

- **`code-function-analysis.googleGeminiModel`**:

  - **Type**: `string`
  - **Options**: `"gemini-1.5-flash"`, `"gemini-1.5-flash-8b"`, `"gemini-1.5-pro"`, `"gemini-1.0-pro"`
  - **Description**: Select the Google Gemini model to use.
  - **Default**: `"gemini-1.5-flash"`

- **`code-function-analysis.feedbackLevel`**:

  - **Type**: `string`
  - **Options**: `"simple"`, `"verbose"`
  - **Description**: Set the level of detail in feedback.
  - **Default**: `"simple"`

- **`code-function-analysis.focusAreas`**:

  - **Type**: `array`
  - **Items**: `"performance"`, `"style"`, `"readability"`, `"complexity"`
  - **Description**: Select the focus areas for feedback.
  - **Default**: `["performance", "style", "readability", "complexity"]`

- **`code-function-analysis.autoAnalyzeOnSelection`**:

  - **Type**: `boolean`
  - **Description**: Automatically analyze code when it is selected.
  - **Default**: `false`

- **`code-function-analysis.expandSelectionToFunction`**:

  - **Type**: `boolean`
  - **Description**: Expand selection to the full function when a single line is selected.
  - **Default**: `true`

---

## Development

### Building the Extension

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Compile the Extension**:

   ```bash
   npm run compile
   ```

   This command performs type checking, linting, and builds the extension using `esbuild`.

3. **For Production Build**:

   ```bash
   npm run package
   ```

### Running the Extension

1. **Open the Extension in VS Code**:

   - Open the project directory in Visual Studio Code.

2. **Start Debugging**:

   - Press `F5` to launch the extension in a new Extension Development Host window.

3. **Test the Extension**:

   - Follow the usage instructions to test the extension's functionality.

---

## Troubleshooting

- **Failed to Get Response from API**:

  - Ensure your API key is correctly set and has the necessary permissions.
  - Verify that you have access to the selected model.
  - Check your internet connection and firewall settings.
  - Review the detailed error messages for specific issues.

- **Extension Not Activating**:

  - Confirm that the activation events in `package.json` are correctly configured.
  - Ensure there are no syntax errors in your code.

- **Command Not Found**:

  - Verify that the command is available in the Command Palette or context menu.
  - Ensure the extension is properly installed and activated.

- **Git Commit Issues**:

  - Make sure Git is installed and accessible from the command line.
  - Ensure your changes are staged before generating a commit message.
  - Check for any errors in the terminal or output panel.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**:

   - Click the "Fork" button at the top right corner of the repository page.

2. **Create a New Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes and Commit**:

   ```bash
   git commit -am "Add your feature"
   ```

4. **Push to Your Fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**:

   - Go to the original repository and click on "New Pull Request".

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Neroli1108/code-function-analysis-vscode-ext/blob/main/LICENSE) file for details.

---

## Acknowledgments

- **OpenAI** for providing the GPT-4 API.
- **Hugging Face** for AI models.
- **Google** for providing the Gemini AI models.
- **Visual Studio Code** for the extension platform.
- **Community Contributors** for their valuable feedback and contributions.

---

**Disclaimer**: This extension sends code snippets and diffs to third-party APIs for analysis and generation tasks. Please ensure compliance with your organization's policies regarding code sharing and avoid sharing sensitive or proprietary code.

---

**Note**: Always keep your API keys secure and avoid committing them to source control.

---
