import { client } from "./client";
import { formatEther } from "ethers";

const chainid = "11155111";
export async function getTransactionsByAddress(address: string) {
  const query = new URLSearchParams({
    chainid: chainid,
    module: "account",
    action: "txlist",
    address: address,
    startblock: "0",
    endblock: "9999999999",
    page: "1",
    offset: "10",
    sort: "desc",
  }).toString();

  const result = await client(query);

  const structuredResult = result.map((transaction: any) => ({
    hash: transaction.hash,
    sender: transaction.from,
    receiver: transaction.to,
    amount: formatEther(transaction.value),
    timestamp: new Date(Number(transaction.timeStamp) * 1000).toLocaleString(),
  }));
  console.log(structuredResult);
  return structuredResult;
}
