import { Editor } from "@monaco-editor/react";

import type { JSX } from "react";
import type { MonacoEditorProps } from "@/types/props";

const MonacoEditor = ({
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
        defaultLanguage={language}
        defaultValue={defaultValue}
        value={value}
        theme={theme}
        onChange={onChange}
        {...(height !== undefined && { height })}
        {...(options !== undefined && { options })}
        {...(onMount !== undefined && { onMount })}
      />
    </div>
  );
};

export default MonacoEditor;
