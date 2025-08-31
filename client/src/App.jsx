import { useState } from "react";
import "./App.css";

import Main from "./cmp/Main";
import LandingPage from "./cmp/LandingPage";

function App() {
  const [showMain, setShowMain] = useState(false);

  return (
    showMain ? (
      <Main />
    ) : (
      <LandingPage onStart={() => setShowMain(true)} />
    )
  );
}

export default App;