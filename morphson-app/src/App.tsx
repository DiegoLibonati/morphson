import { HashRouter } from "react-router-dom";

import type { JSX } from "react";

import ModalAlert from "@/components/Modals/ModalAlert/ModalAlert";

import { useModalContext } from "@/hooks/useModalContext";

import { MorphsonRouter } from "@/router/MorphsonRouter";

const App = (): JSX.Element => {
  const { state: modalState } = useModalContext();

  return (
    <HashRouter>
      {modalState.modal.open && <ModalAlert></ModalAlert>}
      <MorphsonRouter></MorphsonRouter>
    </HashRouter>
  );
};

export default App;
