import { createContext, useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner, Contract, parseEther } from "ethers";
import { contractAddress, contractABI } from "../utils/constants";
import type { ReactNode } from "react";

type TransactionFormData = {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string;
};

interface TransactionContextType {
  currentAccount: string | null;
  formData: TransactionFormData;
  isSending: boolean;
  connectWallet: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => Promise<void>;
}

let provider: BrowserProvider | null;
let signer: JsonRpcSigner | null;
let contract: Contract | null;
let connecting = false;

export const TransactionContext = createContext<TransactionContextType | null>(
  null
);

const connectEthereumProvider = () => {
  try {
    provider = new BrowserProvider(window.ethereum); // 1. Establish Connection between frontend and provider
    console.log("Establised Connection with Provider");
  } catch (error) {
    console.error("Failed to establish connection with Provider.", error);
    alert("Failed to establish wallet connection. Please try again.");
  }
};

const initSigner = async (address: number | string) => {
  if (!provider)
    return alert("Provider not initialized. Please connect your wallet first.");

  try {
    signer = await provider.getSigner(address);
    console.log("Signer initialized:", signer);
  } catch (error) {
    console.error("Failed to initialize signer:", error);
    alert(
      "Failed to access your wallet. Please unlock MetaMask and try again."
    );
  }
};

const createEthereumContract = async () => {
  try {
    if (!signer) {
      alert("Wallet not connected. Please connect your wallet first.");
      return;
    }

    contract = new Contract(contractAddress, contractABI, signer);
    console.log("Contract created:", contract.target);
  } catch (error) {
    console.error("Contract creation failed", error);
    alert("Failed to create contract. Please reconnect your wallet.");
  }
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const detectWalletConnection = async () => {
    try {
      if (!provider) {
        console.warn(
          "Your dApp is not connected to any Ethereum provider yet."
        );
        return;
      }

      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length === 0) {
        console.log("No accounts found. Wallet not connected.");
        return;
      }

      console.log("Detected wallet connections:", accounts);

      const activeAccount = accounts[0];
      await initSigner(activeAccount);
      await createEthereumContract();
      setCurrentAccount(activeAccount);

      console.log(`Using primary account: ${activeAccount}`);
    } catch (error) {
      console.error("Failed to detect wallet connection:", error);
    }
  };

  const detectWalletChange = async (accounts: string[]) => {
    if (connecting) return;
    if (accounts.length === 0) {
      console.log("MetaMask Disconnected");
      setCurrentAccount(null);
      return;
    }

    console.log("Account Switched:", accounts[0]);
    await initSigner(accounts[0]);
    await createEthereumContract();
    setCurrentAccount(accounts[0]);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please Install MetaMask!");
      if (!provider)
        return alert("No provider detected. Please install a provider");

      connecting = true;
      const accounts = await provider.send("eth_requestAccounts", []); // 2. request for connected accounts. If no connected accounts, then show popup
      console.log("Connected Accounts:", accounts);
      setCurrentAccount(accounts[0]);

      await initSigner(accounts[0]); // 3. initialize signer (bind to current account)
      await createEthereumContract(); //4. initialize contract (link ABI + signer)

      console.log(`Wallet successfully connected to: ${accounts[0]}`);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      connecting = false;
    }
  };

  const sendTransaction = async () => {
    try {
      if (!contract) return console.log("Contract not yet Initialized!");

      const { addressTo, amount, keyword, message } = formData;

      setIsSending(true);
      const txHash = await contract.createTransaction(
        addressTo,
        keyword,
        message,
        { value: parseEther(amount) }
      );

      const receipt = await txHash.wait();
      console.log(`Transaction Sent! Hash: ${txHash.hash}`);
      console.log("Receipt:", receipt.logs);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSending(false);
      setFormData({
        addressTo: "",
        amount: "",
        keyword: "",
        message: "",
      });
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      console.log("Connecting to Ethereum provider...");
      connectEthereumProvider();
      detectWalletConnection();

      window.ethereum.on("accountsChanged", detectWalletChange);

      return () => {
        window.ethereum.removeListener("accountsChanged", detectWalletChange);
      };
    }
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        handleChange,
        currentAccount,
        formData,
        isSending,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
