import { useTransactionContext } from "../hooks/useTransactionContext";

export default function Transactions() {
  const { currentAccount, transactions } = useTransactionContext();
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">Transactions</h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see your transactions
          </h3>
        )}
      </div>
    </div>
  );
}
