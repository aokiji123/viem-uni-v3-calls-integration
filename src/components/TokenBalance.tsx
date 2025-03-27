import { useState } from "react";
import { useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useContract } from "../hooks/useContract";
import { CONTRACTS } from "../config/contracts";

export function TokenBalance() {
  const { address } = useAccount();
  const { read, write } = useContract(CONTRACTS.USDC);
  const [balance, setBalance] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchBalance() {
    if (!address) return;
    setLoading(true);
    setError(null);

    const { data, error: readError } = await read("balanceOf", [address]);

    if (readError) {
      setError(readError);
    } else if (data) {
      setBalance(formatUnits(data as bigint, 6));
    }
    setLoading(false);
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!address || !transferTo || !transferAmount) return;

    setLoading(true);
    setError(null);

    try {
      const amount = parseUnits(transferAmount, 6);
      const { error: writeError } = await write("transfer", [
        transferTo,
        amount,
      ]);

      if (writeError) {
        setError(writeError);
      } else {
        setTransferAmount("");
        setTransferTo("");
        // Refresh balance after transfer
        await fetchBalance();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={fetchBalance}
          disabled={loading || !address}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Fetch Balance"}
        </button>
        {balance && <span>Balance: {balance} USDC</span>}
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Recipient Address"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="number"
            step="any"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !address || !transferTo || !transferAmount}
          className="w-full bg-green-500 px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Transfer"}
        </button>
      </form>

      {error && <div className="text-red-500">Error: {error}</div>}
    </div>
  );
}
