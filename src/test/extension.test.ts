import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Should provide correct folding ranges for nested numbered lists', async () => {
        // Create a test document with nested numbered lists
        const content = `1. First level item
   1. Second level item
      1. Third level item
      2. Another third level item
   2. Another second level item
2. Another first level item
   1. Another second level item
3. Yet another first level item`;

        const document = await vscode.workspace.openTextDocument({
            content,
            language: 'markdown'
        });

        // Get the folding ranges
        const foldingRanges = await vscode.commands.executeCommand<vscode.FoldingRange[]>(
            'vscode.executeFoldingRangeProvider',
            document.uri
        );

        // Verify the folding ranges
        assert.ok(foldingRanges, 'Folding ranges should be returned');
        assert.strictEqual(foldingRanges.length, 7, 'Should have 7 folding ranges');

        // First level list (lines 1-6)
        assert.deepStrictEqual(foldingRanges[0], {
            start: 0,
            end: 5,
            kind: vscode.FoldingRangeKind.Region
        });

        // Second level list (lines 2-4)
        assert.deepStrictEqual(foldingRanges[1], {
            start: 1,
            end: 3,
            kind: vscode.FoldingRangeKind.Region
        });

        // Third level list (lines 3-4)
        assert.deepStrictEqual(foldingRanges[2], {
            start: 2,
            end: 3,
            kind: vscode.FoldingRangeKind.Region
        });

        // Second level list (lines 5-5)
        assert.deepStrictEqual(foldingRanges[3], {
            start: 4,
            end: 4,
            kind: vscode.FoldingRangeKind.Region
        });

        // First level list (lines 7-8)
        assert.deepStrictEqual(foldingRanges[4], {
            start: 6,
            end: 7,
            kind: vscode.FoldingRangeKind.Region
        });

        // Second level list (lines 8-8)
        assert.deepStrictEqual(foldingRanges[5], {
            start: 7,
            end: 7,
            kind: vscode.FoldingRangeKind.Region
        });

        // First level list (lines 9-9)
        assert.deepStrictEqual(foldingRanges[6], {
            start: 8,
            end: 8,
            kind: vscode.FoldingRangeKind.Region
        });
    });
}); 