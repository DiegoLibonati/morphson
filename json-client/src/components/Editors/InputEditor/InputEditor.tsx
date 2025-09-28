import { useEffect } from "react";

import { OnChange } from "@monaco-editor/react";

import { MonacoEditor } from "@src/components/Editors/export";

import { useJSONContext, useEditorContext } from "@src/contexts/export";

export const InputEditor = (): JSX.Element => {
  const { handleInputJsonContentUpdate } = useJSONContext();
  const { text, handleSetText } = useEditorContext();

  const onChangeEditorContent: OnChange = (value) => {
    const newContent = value!;

    handleSetText(newContent);
  };

  const onTextEditorChange = () => {
    try {
      const parsed = JSON.parse(text);

      return handleInputJsonContentUpdate(parsed);
    } catch {}
  };

  useEffect(() => {
    onTextEditorChange();
  }, [text]);

  return (
    <MonacoEditor
      className="h-full input-editor"
      defaultValue="{}"
      language="json"
      theme="vs-dark"
      value={text}
      onChange={onChangeEditorContent}
    ></MonacoEditor>
  );
};
