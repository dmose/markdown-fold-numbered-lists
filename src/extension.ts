import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const foldingProvider = new MarkdownFoldingProvider();
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider('markdown', foldingProvider)
    );
}

export class MarkdownFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(
        document: vscode.TextDocument
    ): vscode.FoldingRange[] {
        const text = document.getText();
        const lines = text.split('\n');
        const foldingRanges: vscode.FoldingRange[] = [];

        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trimStart();
            const indentLevel = line.length - trimmedLine.length;
            
            // Check if this is a numbered list item
            const listMatch = trimmedLine.match(/^\d+\.\s/);
            
            if (listMatch) {
                // Find the end of this list item's content
                let j = i;
                
                while (j + 1 < lines.length) {
                    const nextLine = lines[j + 1];
                    const nextTrimmed = nextLine.trimStart();
                    const nextIndent = nextLine.length - nextTrimmed.length;
                    
                    // If we find a line with less indentation, or an empty line, break
                    if (nextTrimmed === '' || nextIndent < indentLevel) {
                        break;
                    }
                    // If we find a line with same indentation and it's a list item, break
                    if (nextIndent === indentLevel && nextTrimmed.match(/^\d+\.\s/)) {
                        break;
                    }
                    j++;
                }

                // Create a folding range for this item
                const range = new vscode.FoldingRange(
                    i,
                    j,
                    vscode.FoldingRangeKind.Region
                );
                foldingRanges.push(range);
            }
        }

        return foldingRanges;
    }
}

export function deactivate() {} 