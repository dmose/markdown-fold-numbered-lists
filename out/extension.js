"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const foldingProvider = new MarkdownFoldingProvider();
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider('markdown', foldingProvider));
}
class MarkdownFoldingProvider {
    provideFoldingRanges(document, context, token) {
        const foldingRanges = [];
        const text = document.getText();
        const lines = text.split('\n');
        let currentListStart = null;
        let currentIndentLevel = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trimLeft();
            // Check if this is a numbered list item
            const listMatch = trimmedLine.match(/^\d+\.\s/);
            if (listMatch) {
                const indentLevel = line.length - trimmedLine.length;
                // If we're starting a new list or a sublist
                if (currentListStart === null || indentLevel > currentIndentLevel) {
                    if (currentListStart !== null) {
                        // Close the previous list
                        foldingRanges.push(new vscode.FoldingRange(currentListStart, i - 1, vscode.FoldingRangeKind.Region));
                    }
                    currentListStart = i;
                    currentIndentLevel = indentLevel;
                }
            }
            else if (currentListStart !== null) {
                // If we hit a non-numbered line or a line with less indentation
                const indentLevel = line.length - trimmedLine.length;
                if (trimmedLine === '' || indentLevel < currentIndentLevel) {
                    foldingRanges.push(new vscode.FoldingRange(currentListStart, i - 1, vscode.FoldingRangeKind.Region));
                    currentListStart = null;
                    currentIndentLevel = 0;
                }
            }
        }
        // Handle the last list if it exists
        if (currentListStart !== null) {
            foldingRanges.push(new vscode.FoldingRange(currentListStart, lines.length - 1, vscode.FoldingRangeKind.Region));
        }
        return foldingRanges;
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map