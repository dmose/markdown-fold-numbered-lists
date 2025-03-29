# Markdown Fold Numbered Lists

A Visual Studio Code extension that makes ordered lists in markdown files foldable.

## Features

- Automatically detects numbered lists in markdown files
- Creates foldable regions for each numbered list
- Supports nested numbered lists
- Preserves list hierarchy and indentation

## Installation

1. Clone this repository
2. Run `npm install`
3. Press F5 to start debugging
4. Open a markdown file with numbered lists to test the extension

## Usage

The extension will automatically detect numbered lists in your markdown files and make them foldable. You can:

- Click the folding icon in the gutter to fold/unfold a list
- Use the keyboard shortcuts:
  - `Ctrl+Shift+[` (Windows/Linux) or `Cmd+Shift+[` (Mac) to fold
  - `Ctrl+Shift+]` (Windows/Linux) or `Cmd+Shift+]` (Mac) to unfold

## Example

```markdown
1. First item
2. Second item
   1. Nested item 1
   2. Nested item 2
3. Third item
```

The above list will be foldable as a single unit, with the nested items also being foldable.

## Requirements

- VS Code version 1.85.0 or higher

## Extension Settings

* `markdownFoldNumberedLists.enabled`: Enable/disable the folding functionality 