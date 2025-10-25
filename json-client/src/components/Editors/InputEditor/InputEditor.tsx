import { useEffect } from "react";

import { OnChange } from "@monaco-editor/react";

import { MonacoEditor } from "@src/components/Editors/MonacoEditor/MonacoEditor";

import { useJSONContext } from "@src/hooks/useJSONContext";
import { useEditorContext } from "@src/hooks/useEditorContext";

export const InputEditor = (): JSX.Element => {
  const { dispatch: jsonDispatch } = useJSONContext();
  const { state: editorState, dispatch: editorDispatch } = useEditorContext();

  const onChangeEditorContent: OnChange = (value) => {
    const newContent = value!;

    editorDispatch({
      type: "SET_TEXT",
      payload: { text: newContent },
    });
  };

  const onTextEditorChange = () => {
    try {
      const parsed = JSON.parse(editorState.text);

      return jsonDispatch({
        type: "INPUT_JSON_CONTENT_UPDATE",
        payload: { content: parsed },
      });
    } catch {}
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
