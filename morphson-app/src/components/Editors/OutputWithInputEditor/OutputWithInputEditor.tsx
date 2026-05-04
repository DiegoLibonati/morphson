import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

import type { OnChange, OnMount } from "@monaco-editor/react";
import type { JSX } from "react";

import MonacoEditor from "@/components/Editors/MonacoEditor/MonacoEditor";

import { useJSONContext } from "@/hooks/useJSONContext";
import { useEditorContext } from "@/hooks/useEditorContext";

const OutputWithInputEditor = (): JSX.Element => {
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

  const onTextEditorChange = (): void => {
    try {
      const parsed = JSON.parse(editorState.text) as Record<string, unknown>;

      jsonDispatch({
        type: "OUTPUT_JSON_MODEL_UPDATE",
        payload: { transformationModel: parsed },
      });
    } catch {
      // invalid JSON — skip
    }
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    if (completionProviderRef.current) {
      completionProviderRef.current.dispose();
    }

    completionProviderRef.current = monacoRef.current.languages.registerCompletionItemProvider(
      "json",
      {
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
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: `Inserts the key: ${key} to refer to the value it represents in the json input`,
              range: range,
            };
          });

          return { suggestions: suggestions };
        },
      }
    );

    return (): void => {
      if (completionProviderRef.current) completionProviderRef.current.dispose();
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

export default OutputWithInputEditor;
