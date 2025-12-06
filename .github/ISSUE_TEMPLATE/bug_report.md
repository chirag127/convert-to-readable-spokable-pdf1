---
name: Bug Report
about: "Report a bug encountered in the application."
title: "[BUG] "
labels: "bug"
assignees: ""

body:
  - type: markdown
    attributes:
      value: |+
        ## 🐞 Bug Report

        Thank you for helping improve our application! Please provide a clear and concise description of the bug.

        **Repository:** [PDF-To-Speech-AI-Converter-Web-App](https://github.com/chirag127/PDF-To-Speech-AI-Converter-Web-App)

        **AI Agent Directives Reference:** [AGENTS.md](https://github.com/chirag127/PDF-To-Speech-AI-Converter-Web-App/blob/main/AGENTS.md)

        --- 
  - type: input
    id: environment
    attributes:
      label: "Environment Details"
      description: "Please specify where the bug occurred (e.g., Browser, OS, Device)."
      placeholder: "e.g., Chrome 120 on Windows 11, Firefox on macOS"
    validations:
      required: true
  - type: input
    id: steps
    attributes:
      label: "Steps to Reproduce"
      description: "Provide a clear, step-by-step guide to reproduce the bug."
      placeholder: "1. Go to page X\n2. Click button Y\n3. Observe Z"
    validations:
      required: true
  - type: input
    id: expected_behavior
    attributes:
      label: "Expected Behavior"
      description: "What you expected to happen."
      placeholder: "e.g., The PDF should be converted to speech."
    validations:
      required: true
  - type: input
    id: actual_behavior
    attributes:
      label: "Actual Behavior"
      description: "What actually happened."
      placeholder: "e.g., An error message appeared, or the conversion failed."
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: "Console/Application Logs (Optional)"
      description: "If applicable, please paste any relevant logs from the browser console or application output."
      placeholder: "Paste your log output here."
    validations:
      required: false
  - type: textarea
    id: additional_context
    attributes:
      label: "Additional Context (Optional)"
      description: "Any other information that might help us debug the issue (e.g., screenshots, specific PDF files)."
      placeholder: "Add screenshots or relevant details here."
    validations:
      required: false
  - type: markdown
    attributes:
      value: |+
        --- 
        **Note:** For security and privacy reasons, please **DO NOT** include sensitive information like API keys or personal data in bug reports.

        This template aligns with the **Apex Technical Authority** standards for high-velocity, zero-defect development.
        Find more details on our AI Agent Directives [here](https://github.com/chirag127/PDF-To-Speech-AI-Converter-Web-App/blob/main/AGENTS.md).
