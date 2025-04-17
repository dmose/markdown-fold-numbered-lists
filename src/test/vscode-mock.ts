// Mock file for vscode API

// Mock the vscode module for testing
export default {
    EndOfLine: {
        LF: 1,
        CRLF: 2
    },
    FoldingRangeKind: {
        Comment: 1,
        Imports: 2,
        Region: 3
    },
    window: {
        showInformationMessage: () => Promise.resolve(undefined)
    },
    Uri: {
        file: (path: string) => ({ fsPath: path, toString: () => `file://${path}` })
    },
    FoldingRange: class FoldingRange {
        constructor(
            public readonly start: number,
            public readonly end: number,
            public readonly kind?: number
        ) {}
    }
};