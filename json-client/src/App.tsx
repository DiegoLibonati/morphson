import { HashRouter } from "react-router-dom";

import { ModalAlert } from "@/src/components/Modals/export";

import { Router } from "@/src/router/export";
import { useModalContext } from "@/src/contexts/export";

const App = (): JSX.Element => {
  const { modal } = useModalContext();

  return (
    <HashRouter>
      {modal.open && <ModalAlert></ModalAlert>}
      <Router></Router>
    </HashRouter>
  );
};

export default App;
