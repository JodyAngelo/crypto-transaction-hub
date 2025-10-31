const BASE_URL = "https://api.etherscan.io/v2/api";
const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export async function client(query: string) {
  const url = `${BASE_URL}?${query}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "0") {
      console.error("Etherscan API Error:", data.message);
      throw new Error(data.message);
    }

    return data.result;
  } catch (error) {
    console.error("Failed to fetch from Etherscan:", error);
  }
}
