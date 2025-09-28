export type EditorState = {
  text: string;
};

export type EditorAction = {
  type: "SET_TEXT";
  payload: { text: string };
};

export type EditorContext = {
  text: Modal;
  handleSetText: (text: string) => void;
};

export interface EditorProviderProps {
  children: React.ReactNode;
}
