import "./styles/App.css";
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import openseaLogo from "./assets/opensea.png";
import Sky from "react-sky";

import {
  connectWallet,
  checkIfWalletIsConnected,
  askContractForMintCount,
  askContractToMintNft,
} from "./utils/interact.js";

const OPENSEA_LINK =
  "https://testnets.opensea.io/collection/squarenft-2ksgv8quli";
const TOTAL_MINT_COUNT = 50;

const imagesObject = {
  0: "",
  1: "",
  2: "",
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [nftsMinted, setNftsMinted] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    const account = await checkIfWalletIsConnected();
    const minted = await askContractForMintCount();

    setCurrentAccount(account);
    setNftsMinted(minted);

    addWalletListener();
  }, []);

  const addWalletListener = () => {
    const { ethereum } = window;

    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        } else {
          setCurrentAccount("");
        }
      });
      ethereum.on("disconnect", () => {
        setCurrentAccount("");
        window.location.reload();
      });
      ethereum.on("chainChanged", (_chainId) => {
        let chainId = _chainId;
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
        } else {
          window.location.reload();
        }
      });
    } else {
      console.log("Make sure you have metamask!");
    }
  };

  const connectWalletPressed = async () => {
    const account = await connectWallet();
    setCurrentAccount(account);
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWalletPressed}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <div className="button-flex">
      <button
        onClick={mintButtonPressed}
        className="cta-button connect-wallet-button"
        disabled={loading}
      >
        {loading && (
          <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }} />
        )}
        {loading && <span>Minting your NFT...</span>}
        {!loading && <span>Mint NFT</span>}
      </button>
    </div>
  );

  const mintButtonPressed = async () => {
    setLoading(true);
    await askContractToMintNft();

    const minted = await askContractForMintCount();
    console.log("No. minted", minted);
    setNftsMinted(minted);
    setLoading(false);
  };

  const TopBar = () => {
    return (
      <div className="top-bar">
        <button
          onClick={() => {
            window.open(OPENSEA_LINK, "_blank");
          }}
          className="cta-button opensea-button"
        >
          <p style={{ marginTop: "auto", marginBottom: "auto" }}>
            Check collection on
          </p>
          <img alt="opensea logo" className="opensea-logo" src={openseaLogo} />
        </button>
      </div>
    );
  };

  /*
   * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
   */
  return (
    <div className="App">
      <TopBar />
      <div className="container">
        <Sky
          images={{
            /* FORMAT AS FOLLOWS */
            0: "https://storage.opensea.io/files/3e5282cab7426868cd5e63b0cbd89f2b.svg",
            1: "https://storage.opensea.io/files/3a08af00b2e6d868a35d43dcb83bab1e.svg",
            2: "https://storage.opensea.io/files/fa01d350878cb33d6d15055b1261a25b.svg",
            3: "https://storage.opensea.io/files/9c39d71e9ad49857fa2b809749a48a5c.svg",
            4: "https://storage.opensea.io/files/671b8f8c249d61a0174cc1345a48bccb.svg",
          }}
          how={
            50
          } /* Pass the number of images Sky will render chosing randomly */
          time={40} /* time of animation */
          size={"200px"} /* size of the rendered images */
          background={"darkslategray"} /* color of background */
        />
        <div className="backdrop" style={{ paddingLeft: "5px" }}>
          <p className="header gradient-text"> Mint your random NFT!</p>
          <p className="sub-text">
            You can mint a pseudo-random three-word combination NFT right here.
          </p>
        </div>
        <div
          style={{
            flex: 0.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
        </div>

        <div className="backdrop">
          <p className="mint-count">Minted NFTs:</p>
          <p className="mint-count">
            {nftsMinted}/{TOTAL_MINT_COUNT}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
