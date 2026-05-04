import { createContext } from "react";

import type { EditorContext as EditorContextT } from "@/types/contexts";

export const EditorContext = createContext<EditorContextT | null>(null);
