import { useTransactionContext } from "../hooks/useTransactionContext";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from "./";
import { shortenAddress } from "../utils/shortenAddress";

interface InputProps {
  placeholder: string;
  name: string;
  type: string;
  value?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
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
    className="my-2 w-full p-2 outline-none bg-transparent border border-[#d3d3d3]/60 rounded-md text-[#1F2A36] placeholder:text-[#1F2A36]/70 text-sm focus:border-[#1F2A36] transition-colors duration-200"
  />
);

export default function Welcome() {
  const {
    connectWallet,
    sendTransaction,
    handleChange,
    balance,
    isSending,
    currentAccount,
    formData,
  } = useTransactionContext();

  const commonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center text-sm font-medium text-[#1F2A36] backdrop-blur-sm border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-white/60 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]transition-all duration-300";

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-[#1F2A36] font-semibold tracking-tight py-1">
            Send Crypto <br /> across the world
          </h1>
          <p className="text-left mt-5 text-[#1F2A36]/80 font-normal md:w-9/12 w-11/12 text-base leading-relaxed">
            Explore the crypto world. Buy and sell cryptocurrencies easily on
            SendIt
          </p>

          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#1F2A36] p-3 rounded-full cursor-pointer hover:bg-[#364150] transition-colors duration-200"
            >
              <AiFillPlayCircle className="text-[#f9f5f0] mr-2" />
              <p className="text-[#f9f5f0] text-base font-semibold">
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
          {/* Ethereum Card */}
          <div className="p-3 justify-end items-start flex-col rounded-xl h-40 w-72 my-5 eth-card black-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-300 text-xs mt-1">
                    Available Balance
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {balance ? `${balance} ETH` : "0 ETH"}
                  </p>
                </div>

                <BsInfoCircle fontSize={17} color="#fff" />
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-light text-sm">
                    {currentAccount ? shortenAddress(currentAccount) : ""}
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    Ethereum
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center bg-[#ffffffcc] rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] border border-[#1F2A36]/10">
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
              placeholder="Enter Message"
              name="message"
              type="text"
              value={formData.message}
              handleChange={handleChange}
            />

            {isSending ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={sendTransaction}
                disabled={!currentAccount}
                className={`text-[#f9f5f0] w-full mt-2 border p-2 border-[#1F2A36] rounded-full font-medium transition-all duration-300 ease-out transform ${
                  !currentAccount
                    ? "bg-gray-400 cursor-not-allowed opacity-60"
                    : "bg-[#1F2A36] hover:bg-[#2b3845] hover:shadow-[0_0_15px_rgba(31,42,54,0.3)] hover:scale-[1.02] cursor-pointer"
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
