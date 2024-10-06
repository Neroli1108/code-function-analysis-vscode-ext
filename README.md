# Code Function Analysis Extension

**Version:** 1.0.0  
**Author:** Nero 
**Repository:** [GitHub Repository Link](https://github.com/Neroli1108/code-function-analysis-vscode-ext)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Setting Up the OpenAI API Key](#setting-up-the-openai-api-key)
  - [Configuring Extension Settings](#configuring-extension-settings)
- [Usage](#usage)
  - [Analyzing a Function](#analyzing-a-function)
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

**Code Function Analysis** is a Visual Studio Code extension that provides intelligent, context-aware analysis of your selected code functions. Leveraging advanced AI through OpenAI's GPT-4 API, this tool offers comprehensive feedback on various aspects of your code, including:

- Performance optimization
- Naming conventions
- Code quality
- Opportunities for improvement

Transform your coding experience with mentor-like suggestions and best practices to enhance your code's readability, maintainability, and efficiency.

## Features

- **Big O Complexity Analysis**: Understand the time and space complexity of your functions.
- **Variable Naming and Style Checks**: Ensure compliance with language-specific style guides (e.g., PEP 8 for Python).
- **Code Elegance Evaluation**: Receive suggestions to make your code more concise and readable.
- **Mentor-Like Feedback**: Get constructive advice with clear explanations for each recommendation.
- **Interactive Learning**: Access relevant documentation and examples for further learning.
- **Feedback Customization**: Tailor the analysis focus and feedback level to your preferences.
- **Multi-Language Support**: Initially supports Python, with plans to extend to JavaScript, Java, C++, and more.

## Installation

### From the VS Code Marketplace

*(Coming Soon)*

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

5. **Install the Extension**:

   - Open Visual Studio Code.
   - Go to `Extensions` (Ctrl+Shift+X or Cmd+Shift+X).
   - Click on the `...` menu and select `Install from VSIX...`.
   - Navigate to the `code-function-analysis-vscode-ext` directory and select the generated `.vsix` file.

## Requirements

- **Visual Studio Code** version `1.94.0` or higher.
- **Node.js** version `14.x` or higher.
- An **OpenAI API Key** with access to the GPT-4 model.

## Getting Started

### Setting Up the OpenAI API Key

1. **Obtain an API Key**:

   - Sign up or log in to the [OpenAI Platform](https://platform.openai.com/).
   - Navigate to the API keys section and generate a new secret key.

2. **Configure the API Key in VS Code**:

   - Open Visual Studio Code.
   - Go to `File` > `Preferences` > `Settings` (or `Code` > `Preferences` > `Settings` on macOS).
   - Search for `Code Function Analysis`.
   - Enter your API key in the `Code-function-analysis: Api Key` field.

   **Note**: Keep your API key secure and do not share it publicly.

### Configuring Extension Settings

- **Feedback Level**:

  - Choose between `"simple"` or `"verbose"` feedback.

- **Focus Areas**:

  - Select the focus areas for analysis: `performance`, `style`, `readability`.

## Usage

### Analyzing a Function

1. **Open a Code File**:

   - Open a code file in a supported language (e.g., Python).

2. **Select a Function**:

   - Highlight the function code you want to analyze.

3. **Run the Analysis Command**:

   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   - Type `Analyze Selected Function` and select the command.

4. **View the Analysis**:

   - A new panel will display the analysis, including suggestions and improvements.

## Commands

- **Analyze Selected Function**:

  - **Command ID**: `code-function-analysis.analyzeFunction`
  - **Description**: Analyzes the selected code function and provides feedback.

## Extension Settings

- **`code-function-analysis.apiKey`**:

  - **Type**: `string`
  - **Description**: Your OpenAI API key.
  - **Default**: `""` (empty string)

- **`code-function-analysis.feedbackLevel`**:

  - **Type**: `string`
  - **Options**: `"simple"`, `"verbose"`
  - **Description**: Set the level of detail in feedback.
  - **Default**: `"simple"`

- **`code-function-analysis.focusAreas`**:

  - **Type**: `array`
  - **Items**: `"performance"`, `"style"`, `"readability"`
  - **Description**: Select the focus areas for feedback.
  - **Default**: `["performance", "style", "readability"]`

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

## Troubleshooting

- **Failed to Get Response from OpenAI API**:

  - Ensure your API key is correctly set and has the necessary permissions.
  - Verify that you have access to the GPT-4 model.
  - Check your internet connection and firewall settings.
  - Review the detailed error messages for specific issues.

- **Extension Not Activating**:

  - Confirm that the activation events in `package.json` are correctly configured.
  - Ensure there are no syntax errors in your code.

- **Command Not Found**:

  - Verify that the command `Analyze Selected Function` is available in the Command Palette.
  - Ensure the extension is properly installed and activated.

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **OpenAI** for providing the GPT-4 API.
- **Visual Studio Code** for the extension platform.
- **Community Contributors** for their valuable feedback and contributions.

---

**Disclaimer**: This extension sends code snippets to the OpenAI API for analysis. Please ensure compliance with your organization's policies regarding code sharing and avoid sharing sensitive or proprietary code.