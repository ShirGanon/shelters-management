import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ShelterFinder from "./cmp/ShelterFinder";
import React from "react";


import Main from "./cmp/Main";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ShelterFinder />
  );
}

export default App;
