import {
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  parseEther,
  formatEther,
} from "ethers";
import { contractAddress, contractABI } from "./constants";
import type { Eip1193Provider } from "ethers"; // EIP-1193 = the official spec describing how dApps and wallets talk to each other in JavaScript.

interface SendTransactionData {
  from: string;
  transaction: {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
  };
}

let provider: BrowserProvider | null;
let signer: JsonRpcSigner | null;
let contract: Contract | null;

export const connectProvider = (externalProvider?: Eip1193Provider) => {
  try {
    // @ts-ignore
    provider = new BrowserProvider(externalProvider);
    console.log("Establised Connection with Provider");
  } catch (error) {
    console.error("Failed to initialize Provider.", error);
  }
};

export const initSigner = async (address: number | string) => {
  signer = await provider!.getSigner(address);
  console.log("Signer initialized:", signer);
};

export const requestAccount = async () => {
  try {
    const accounts = await provider!.send("eth_requestAccounts", []);
    console.log("Connected Accounts:", accounts);
    return accounts[0];
  } catch (error) {
    console.error("Error requesting account:", error);
    return null;
  }
};

export const initContract = async () => {
  try {
    contract = new Contract(contractAddress, contractABI, signer);
    console.log("Contract initialized:", contract.target);
  } catch (error) {
    console.error("Contract Initialization failed", error);
  }
};

export const sendTransaction = async (data: SendTransactionData) => {
  try {
    const { addressTo, amount, keyword, message } = data.transaction;

    const txHash = await contract!.createTransaction(
      addressTo,
      keyword,
      message,
      { value: parseEther(amount) }
    );

    const receipt = await txHash.wait();
    console.log("Receipt:", receipt.logs);
    console.log(`Transaction Sent! Hash: ${txHash.hash}`);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
};
