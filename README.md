# Jira RTL

A lightweight Microsoft Edge / Chromium extension for automatic RTL support in Jira.

## What it does

- Detects Hebrew and Arabic text and displays it RTL.
- Keeps English text LTR.
- Keeps code and technical snippets LTR inside RTL Jira content.
- Handles Jira issue summaries, rich-text descriptions, comments, issue fields, dialogs, cards and editors.
- Updates dynamically loaded Jira content using `MutationObserver`.
- Updates direction while typing in editable Jira fields.
- Avoids flipping Jira navigation and surrounding application UI.
- Uses no external libraries or runtime dependencies.

## Load locally in Microsoft Edge

1. Clone or download this repository.
2. Open `edge://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Select this repository folder.
6. Open Jira or refresh an already-open Jira tab.

After pulling a newer version from GitHub, use **Reload** on the extension card in `edge://extensions`, then refresh Jira.

## Version

Current development version: **0.2.0**

The extension is intentionally selector-tolerant because Atlassian changes Jira's generated DOM and `data-testid` values over time. Real Jira testing may reveal organization/version-specific selectors that should be added.
