import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const foldingProvider = new MarkdownFoldingProvider();
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider('markdown', foldingProvider)
    );
}

class MarkdownFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(
        document: vscode.TextDocument,
        context: vscode.FoldingContext,
        token: vscode.CancellationToken
    ): vscode.FoldingRange[] {
        const foldingRanges: vscode.FoldingRange[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        let currentListStart: number | null = null;
        let currentIndentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trimStart();
            
            // Check if this is a numbered list item
            const listMatch = trimmedLine.match(/^\d+\.\s/);
            if (listMatch) {
                const indentLevel = line.length - trimmedLine.length;
                
                // If we're starting a new list or a sublist
                if (currentListStart === null || indentLevel > currentIndentLevel) {
                    if (currentListStart !== null) {
                        // Close the previous list
                        foldingRanges.push(new vscode.FoldingRange(
                            currentListStart,
                            i - 1,
                            vscode.FoldingRangeKind.Region
                        ));
                    }
                    currentListStart = i;
                    currentIndentLevel = indentLevel;
                }
            } else if (currentListStart !== null) {
                // If we hit a non-numbered line or a line with less indentation
                const indentLevel = line.length - trimmedLine.length;
                if (trimmedLine === '' || indentLevel < currentIndentLevel) {
                    foldingRanges.push(new vscode.FoldingRange(
                        currentListStart,
                        i - 1,
                        vscode.FoldingRangeKind.Region
                    ));
                    currentListStart = null;
                    currentIndentLevel = 0;
                }
            }
        }

        // Handle the last list if it exists
        if (currentListStart !== null) {
            foldingRanges.push(new vscode.FoldingRange(
                currentListStart,
                lines.length - 1,
                vscode.FoldingRangeKind.Region
            ));
        }

        return foldingRanges;
    }
}

export function deactivate() {} 