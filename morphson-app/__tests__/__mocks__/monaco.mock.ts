export const languages = {
  registerCompletionItemProvider: jest.fn(() => ({ dispose: jest.fn() })),
  CompletionItemKind: { Function: 1 },
  CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
};
