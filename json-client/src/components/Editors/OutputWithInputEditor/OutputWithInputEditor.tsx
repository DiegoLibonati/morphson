import { useEffect, useRef } from "react";
import { OnChange, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { MonacoEditor } from "@/src/components/Editors/export";

import { useJSONContext } from "@/src/contexts/export";

export const OutputWithInputEditor = (): JSX.Element => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const completionProviderRef = useRef<monaco.IDisposable | null>(null);

  const { inputJson, outputJson, handleOutputJsonModelUpdate } =
    useJSONContext();

  const onChangeEditor: OnChange = (value) => {
    const newContent = value!;
    return handleOutputJsonModelUpdate(newContent);
  };

  const onMountEditor: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    if (completionProviderRef.current) {
      completionProviderRef.current.dispose();
    }

    completionProviderRef.current =
      monacoRef.current.languages.registerCompletionItemProvider("json", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = inputJson.keys.map((key) => {
            return {
              label: `input.${key}`,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `"input.${key}"`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: `Inserts the key: ${key} to refer to the value it represents in the json input`,
              range: range,
            };
          });

          return { suggestions: suggestions };
        },
      });

    return () => {
      if (completionProviderRef.current)
        completionProviderRef.current.dispose();
    };
  }, [inputJson.keys]);

  return (
    <MonacoEditor
      className="h-full output-with-input-editor"
      defaultValue="{}"
      language="json"
      theme="vs-dark"
      value={outputJson.model}
      onChange={onChangeEditor}
      onMount={onMountEditor}
    ></MonacoEditor>
  );
};
