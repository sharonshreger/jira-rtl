# Jira RTL

A lightweight Microsoft Edge / Chromium extension that automatically applies RTL direction to Hebrew and Arabic text in Jira while keeping English and code LTR.

## Current features

- Detects text direction from the first strong RTL/LTR character.
- Keeps code and preformatted text LTR.
- Watches dynamically loaded Jira content with MutationObserver.
- Runs without external libraries or dependencies.

## Load locally in Edge

1. Clone this repository.
2. Open `edge://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked**.
5. Select the repository folder.

## Status

Initial working engine. Jira-specific handling for editors, descriptions, comments, fields and boards will be refined after testing against the target Jira environment.
