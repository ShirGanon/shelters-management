import React from "react";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => {
  return (
    <header className="hero">
      <div className="overlay"></div>
      <img src="../HITLogo.png" alt="HIT Logo" className="HITlogo" />
      <div className="content">
        <h1>WELCOME TO THE SHELTER PROJECT</h1>
        <p>some words on the project</p>
        <p>names of the students</p>
        <button className="btn" onClick={onStart}>Get Started</button>
      </div>
    </header>
  );
};

export default LandingPage;