import { useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from "./";
import {
  connectProvider,
  initSigner,
  initContract,
  requestAccount,
  sendTransaction,
} from "../utils/contractServices";
import { shortenAddress } from "../utils/shortenAddress";

interface InputProps {
  placeholder: string;
  name: string;
  type: string;
  value?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

type TransactionFormData = {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string;
};

interface SendTransactionData {
  from: string;
  transaction: TransactionFormData;
}

const Input = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
}: InputProps) => (
  <input
    placeholder={placeholder}
    type={type}
    step="any"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm! p-2 outline-none! bg-transparent! border-none! text-white text-sm white-glassmorphism"
  />
);

export default function Welcome() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const commonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

  const connectWallet = async () => {
    try {
      // 1: mark connection state
      setIsConnecting(true);

      // 2: connect provider (MetaMask / injected wallet)
      // @ts-ignore
      if (!window.ethereum) {
        console.error("MetaMask not found. Please install it first.");
        return;
      }
      // @ts-ignore
      connectProvider(window.ethereum);

      // 3: request accounts (user approval popup)
      const account = await requestAccount();
      if (!account) return;

      // 4: initialize signer (bind to current account)
      await initSigner(account);

      // 5: update UI / React state
      setCurrentAccount(account);

      // 6: initialize contract (link ABI + signer)
      await initContract();

      console.log(`Wallet connected: ${account}`);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      // 7: allow listener again (so account switch works)
      setIsConnecting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSending(true);
      const txData: SendTransactionData = {
        from: currentAccount!,
        transaction: formData,
      };

      await sendTransaction(txData);
    } catch (error) {
      console.error("Transaction Failed:", error);
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
    const handleAccountChange = async (accounts: string[]) => {
      if (isConnecting) return;

      if (accounts.length === 0) {
        console.log("Metamask Disconnected");
        setCurrentAccount(null);
        return;
      }

      console.log("Account Switched:", accounts[0]);
      await initSigner(accounts[0]);
      await initContract();
      setCurrentAccount(accounts[0]);
    };

    // @ts-ignore
    window.ethereum.on("accountsChanged", handleAccountChange);

    return () => {
      // @ts-ignore
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  }, [isConnecting]);

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily on
            SendIt
          </p>

          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${commonStyles}`}>Reliability</div>
            <div
              className={`rounded-tr-2xl sm:rounded-tr-none ${commonStyles}`}
            >
              Security
            </div>
            <div className={`sm:rounded-tr-2xl ${commonStyles}`}>Ethereum</div>
            <div className={`sm:rounded-bl-2xl ${commonStyles}`}>Web 3.0</div>
            <div
              className={`rounded-bl-2xl sm:rounded-bl-none ${commonStyles}`}
            >
              Low Fees
            </div>
            <div className={`rounded-br-2xl ${commonStyles}`}>Blockchain</div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {currentAccount ? shortenAddress(currentAccount) : ""}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input
              placeholder="Address To"
              name="addressTo"
              type="text"
              value={formData.addressTo}
              handleChange={handleChange}
            />

            <Input
              placeholder="Amount (ETH)"
              name="amount"
              type="text"
              value={formData.amount}
              handleChange={handleChange}
            />

            <Input
              placeholder="Keyword (Gif)"
              name="keyword"
              type="text"
              value={formData.keyword}
              handleChange={handleChange}
            />

            <Input
              placeholder="Enter Message"
              name="message"
              type="text"
              value={formData.message}
              handleChange={handleChange}
            />

            <div className="h-px w-full bg-gray-400 my-2" />

            {isSending ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!currentAccount}
                className={`text-white w-full mt-2 border p-2 border-[#3d4f7c] rounded-full  transition-all duration-300 ease-out transform ${
                  !currentAccount
                    ? "bg-gray-500 cursor-not-allowed opacity-60"
                    : "hover:bg-[#3d4f7c] hover:shadow-[0_0_15px_rgba(61,79,124,0.6)] hover:scale-[1.02] cursor-pointer"
                }`}
              >
                Send Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
