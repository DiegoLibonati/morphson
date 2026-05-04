import { createContext } from "react";

import type { ModalContext as ModalContextT } from "@/types/contexts";

export const ModalContext = createContext<ModalContextT | null>(null);
