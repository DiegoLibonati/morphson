import { OnChange } from "@monaco-editor/react";

import { MonacoEditor } from "@/src/components/Editors/export";

import { useJSONContext } from "@/src/contexts/export";

export const InputEditor = (): JSX.Element => {
  const { inputJson, handleInputJsonContentUpdate } = useJSONContext();

  const onChangeEditorContent: OnChange = (value) => {
    const newContent = value!;

    return handleInputJsonContentUpdate(newContent);
  };

  return (
    <MonacoEditor
      className="h-full input-editor"
      defaultValue="{}"
      language="json"
      theme="vs-dark"
      value={inputJson.content}
      onChange={onChangeEditorContent}
    ></MonacoEditor>
  );
};
