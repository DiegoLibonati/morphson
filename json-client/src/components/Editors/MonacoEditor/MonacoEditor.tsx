import { editor } from "monaco-editor";
import { Editor, OnChange, OnMount } from "@monaco-editor/react";

import { GeneralProps } from "@/src/entities/entities.d";

interface MonacoEditorProps extends GeneralProps {
  language: string;
  defaultValue: string;
  value: string;
  theme: string;
  height?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  onChange: OnChange;
  onMount?: OnMount;
}

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
