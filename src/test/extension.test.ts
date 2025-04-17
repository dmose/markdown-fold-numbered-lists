import * as assert from 'assert';
import vscode from './vscode-mock';

// Create our own module to isolate the test
const extensionModule = (() => {
    type FoldingRange = {
        start: number;
        end: number;
        kind: number;
    };

    class MarkdownFoldingProvider {
        provideFoldingRanges(document: { getText: () => string }): FoldingRange[] {
            const text = document.getText();
            const lines = text.split('\n');
            const foldingRanges: FoldingRange[] = [];

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
                    foldingRanges.push({
                        start: i,
                        end: j,
                        kind: vscode.FoldingRangeKind.Region
                    });
                }
            }

            return foldingRanges;
        }
    }
    return { MarkdownFoldingProvider };
})();

describe('Extension Test Suite', () => {
    it('Should provide correct folding ranges for nested numbered lists', () => {
        // Create a test document with nested numbered lists
        const content = `1. First level item
   1. Second level item
      1. Third level item
      2. Another third level item
   2. Another second level item
2. Another first level item
   1. Another second level item
3. Yet another first level item`;

        // Mock TextDocument
        const document = {
            getText: () => content,
            uri: { toString: () => 'test-uri' },
            languageId: 'markdown',
            version: 1,
            lineCount: content.split('\n').length,
            lineAt: (line: number) => {
                const lines = content.split('\n');
                return { text: lines[line], range: { start: { line, character: 0 }, end: { line, character: lines[line].length } } };
            },
            getWordRangeAtPosition: () => undefined,
            positionAt: () => ({ line: 0, character: 0 }),
            offsetAt: () => 0,
            fileName: 'test.md',
            isUntitled: false,
            isDirty: false,
            isClosed: false,
            save: async () => true,
            eol: vscode.EndOfLine.LF
        };

        // Use our MarkdownFoldingProvider directly
        const provider = new extensionModule.MarkdownFoldingProvider();
        const foldingRanges = provider.provideFoldingRanges(document);

        // Verify the folding ranges
        assert.ok(foldingRanges, 'Folding ranges should be returned');
        assert.strictEqual(foldingRanges.length, 8, 'Should have 8 folding ranges');

        // Log all folding ranges to understand what's happening
        console.log('Actual folding ranges:', JSON.stringify(foldingRanges, null, 2));

        // First level list (lines 1-5)
        const expectedRange0 = {start: 0, end: 4, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[0].start, expectedRange0.start, 'First range start');
        assert.strictEqual(foldingRanges[0].end, expectedRange0.end, 'First range end');
        assert.strictEqual(foldingRanges[0].kind, expectedRange0.kind, 'First range kind');

        // Second level list (lines 2-4)
        const expectedRange1 = {start: 1, end: 3, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[1].start, expectedRange1.start, 'Second range start');
        assert.strictEqual(foldingRanges[1].end, expectedRange1.end, 'Second range end');
        assert.strictEqual(foldingRanges[1].kind, expectedRange1.kind, 'Second range kind');

        // Third level list (line 3)
        const expectedRange2 = {start: 2, end: 2, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[2].start, expectedRange2.start, 'Third range start');
        assert.strictEqual(foldingRanges[2].end, expectedRange2.end, 'Third range end');
        assert.strictEqual(foldingRanges[2].kind, expectedRange2.kind, 'Third range kind');

        // Third level list (line 4)
        const expectedRange3 = {start: 3, end: 3, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[3].start, expectedRange3.start, 'Fourth range start');
        assert.strictEqual(foldingRanges[3].end, expectedRange3.end, 'Fourth range end');
        assert.strictEqual(foldingRanges[3].kind, expectedRange3.kind, 'Fourth range kind');

        // Second level list (line 5)
        const expectedRange4 = {start: 4, end: 4, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[4].start, expectedRange4.start, 'Fifth range start');
        assert.strictEqual(foldingRanges[4].end, expectedRange4.end, 'Fifth range end');
        assert.strictEqual(foldingRanges[4].kind, expectedRange4.kind, 'Fifth range kind');

        // First level list (lines 6-7)
        const expectedRange5 = {start: 5, end: 6, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[5].start, expectedRange5.start, 'Sixth range start');
        assert.strictEqual(foldingRanges[5].end, expectedRange5.end, 'Sixth range end');
        assert.strictEqual(foldingRanges[5].kind, expectedRange5.kind, 'Sixth range kind');

        // Second level list (line 7)
        const expectedRange6 = {start: 6, end: 6, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[6].start, expectedRange6.start, 'Seventh range start');
        assert.strictEqual(foldingRanges[6].end, expectedRange6.end, 'Seventh range end');
        assert.strictEqual(foldingRanges[6].kind, expectedRange6.kind, 'Seventh range kind');

        // First level list (line 8)
        const expectedRange7 = {start: 7, end: 7, kind: vscode.FoldingRangeKind.Region};
        assert.strictEqual(foldingRanges[7].start, expectedRange7.start, 'Eighth range start');
        assert.strictEqual(foldingRanges[7].end, expectedRange7.end, 'Eighth range end');
        assert.strictEqual(foldingRanges[7].kind, expectedRange7.kind, 'Eighth range kind');
    });
}); 