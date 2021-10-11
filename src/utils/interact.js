import { ethers } from "ethers";
import MyEpicNFT from "./MyEpicNFT.json";
const CONTRACT_ADDRESS = "0x7928528826bdd1C8De615feB08e852115B12528b";

export const checkIfWalletIsConnected = async () => {
  const { ethereum } = window;

  if (ethereum) {
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setupEventListener();
        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
        }
        return account;
      } else {
        return "";
      }
    } catch (error) {
      console.log(error.message);
      return "";
    }
  } else {
    console.log("Make sure you have metamask!");
    return "";
  }
};

export const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    /*
     * Fancy method to request access to account.
     */
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    /*
     * Boom! This should print out public address once we authorize Metamask.
     */
    console.log("Connected", accounts[0]);

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    setupEventListener();
    return accounts[0];
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const askContractToMintNft = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MyEpicNFT.abi,
        signer
      );

      console.log("Going to pop wallet now to pay gas...");
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.");
      await nftTxn.wait();

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
      );
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

const setupEventListener = () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MyEpicNFT.abi,
        signer
      );

      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        alert(
          `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
        );
      });
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const askContractForMintCount = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MyEpicNFT.abi,
        signer
      );

      let countValue = await connectedContract.getTotalNFTsMinted();

      return countValue.toNumber();
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};
