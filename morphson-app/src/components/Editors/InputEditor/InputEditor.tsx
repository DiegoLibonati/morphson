import { useEffect } from "react";

import type { JSX } from "react";
import type { OnChange } from "@monaco-editor/react";

import MonacoEditor from "@/components/Editors/MonacoEditor/MonacoEditor";

import { useJSONContext } from "@/hooks/useJSONContext";
import { useEditorContext } from "@/hooks/useEditorContext";

const InputEditor = (): JSX.Element => {
  const { dispatch: jsonDispatch } = useJSONContext();
  const { state: editorState, dispatch: editorDispatch } = useEditorContext();

  const onChangeEditorContent: OnChange = (value) => {
    const newContent = value!;

    editorDispatch({
      type: "SET_TEXT",
      payload: { text: newContent },
    });
  };

  const onTextEditorChange = (): void => {
    try {
      const parsed = JSON.parse(editorState.text) as Record<string, unknown>;

      jsonDispatch({
        type: "INPUT_JSON_CONTENT_UPDATE",
        payload: { content: parsed },
      });
    } catch {
      // invalid JSON — skip
    }
  };

  useEffect(() => {
    onTextEditorChange();
  }, [editorState.text]);

  return (
    <MonacoEditor
      className="h-full input-editor"
      defaultValue="{}"
      language="json"
      theme="vs-dark"
      value={editorState.text}
      onChange={onChangeEditorContent}
    ></MonacoEditor>
  );
};

export default InputEditor;
