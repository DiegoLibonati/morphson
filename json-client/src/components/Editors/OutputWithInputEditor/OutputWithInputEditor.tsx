import { useEffect, useRef } from "react";
import { OnChange, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { MonacoEditor } from "@src/components/Editors/MonacoEditor/MonacoEditor";

import { useJSONContext } from "@src/hooks/useJSONContext";
import { useEditorContext } from "@src/hooks/useEditorContext";

export const OutputWithInputEditor = (): JSX.Element => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const completionProviderRef = useRef<monaco.IDisposable | null>(null);

  const { state: jsonState, dispatch: jsonDispatch } = useJSONContext();
  const { state: editorState, dispatch: editorDispatch } = useEditorContext();

  const onChangeEditor: OnChange = (value) => {
    const newContent = value!;

    editorDispatch({
      type: "SET_TEXT",
      payload: { text: newContent },
    });
  };

  const onMountEditor: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const onTextEditorChange = () => {
    try {
      const parsed = JSON.parse(editorState.text);

      return jsonDispatch({
        type: "OUTPUT_JSON_MODEL_UPDATE",
        payload: { transformationModel: parsed },
      });
    } catch {}
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

          const suggestions = jsonState.inputJson.keys.map((key) => {
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
  }, [jsonState.inputJson.keys]);

  useEffect(() => {
    onTextEditorChange();
  }, [editorState.text]);

  return (
    <MonacoEditor
      className="h-full output-with-input-editor"
      defaultValue="{}"
      language="json"
      theme="vs-dark"
      value={editorState.text}
      onChange={onChangeEditor}
      onMount={onMountEditor}
    ></MonacoEditor>
  );
};
