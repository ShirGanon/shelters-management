import React from "react";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => {
  return (
    <header className="hero">
      <div className="overlay"></div>
      <img src="../HITLogo.png" alt="HIT Logo" className="HITlogo" />
      <div className="content">
        <h1>WELCOME TO THE SHELTER PROJECT</h1>
        <p>
          <ul><li>Shelter Management System</li> <li>"An innovative solution for creating order,
            supervision, and control over urban shelters."</li>
          </ul>
            
        </p>
        <p>Participants:</p>
        <ul>
          <li>Shir Ganon</li>
          <li>Adi Beker</li>
          <li>Sapir Baruch</li>
          <li>Ofir Hafif</li>
          <li>Roy Serbi</li>
        </ul>
        <button className="btn" onClick={onStart}>Get Started</button>
      </div>
    </header>
  );
};

export default LandingPage;