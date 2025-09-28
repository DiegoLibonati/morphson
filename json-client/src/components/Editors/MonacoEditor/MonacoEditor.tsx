import { Editor } from "@monaco-editor/react";

import { MonacoEditorProps } from "@src/entities/props";

export const MonacoEditor = ({
  height,
  language,
  options,
  theme,
  defaultValue,
  value,
  className,
  onChange,
  onMount,
}: MonacoEditorProps): JSX.Element => {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        value={value}
        theme={theme}
        options={options}
        onChange={onChange}
        onMount={onMount}
      />
    </div>
  );
};
