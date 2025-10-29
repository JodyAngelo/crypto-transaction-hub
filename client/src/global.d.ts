import type { MetaMaskInpageProvider } from "@metamask/providers";
import type { Eip1193Provider } from "ethers";

declare global {
  interface Window {
    /**
     * The Ethereum provider injected by MetaMask or another EIP-1193 compatible wallet.
     * It supports standard request() calls and event emitters like .on() / .removeListener().
     */
    ethereum: MetaMaskInpageProvider & Eip1193Provider;
  }
}

export {};
