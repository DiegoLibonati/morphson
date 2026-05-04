import { createContext } from "react";

import type { JSONContext as JSONContextT } from "@/types/contexts";

export const JSONContext = createContext<JSONContextT | null>(null);
