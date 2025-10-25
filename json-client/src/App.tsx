import { HashRouter } from "react-router-dom";

import { ModalAlert } from "@src/components/Modals/ModalAlert/ModalAlert";

import { useModalContext } from "@src/hooks/useModalContext";

import { AppRouter } from "@src/router/AppRouter";

const App = (): JSX.Element => {
  const { state: modalState } = useModalContext();

  return (
    <HashRouter>
      {modalState.modal.open && <ModalAlert></ModalAlert>}
      <AppRouter></AppRouter>
    </HashRouter>
  );
};

export default App;
