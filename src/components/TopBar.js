import React from "react";
import "../styles/TopBar.css";

const TopBar = ({ setCurrentAccount }) => {
  return (
    <div className="top-bar">
      <button
        onClick={() => setCurrentAccount("")}
        className="cta-button disconnect-wallet-button"
      >
        Disconnect wallet
      </button>
    </div>
  );
};

export default TopBar;
