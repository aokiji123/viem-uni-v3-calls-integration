import { useEffect, useState } from "react";
import "./App.css";
import { getPoolInfo } from "./viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { TokenBalance } from "./components/TokenBalance";

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [poolInfo, setPoolInfo] = useState<{
    sqrtPriceX96: bigint;
    tick: number;
    liquidity: bigint;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPoolInfo() {
      try {
        const info = await getPoolInfo();
        setPoolInfo(info);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch pool info"
        );
      }
    }

    if (isConnected) {
      fetchPoolInfo();
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div className="p-4">
        <button
          onClick={() => connect({ connector: injected() })}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between flex-col items-center mb-6">
        <h1 className="text-2xl font-bold">Uniswap V3 Pool Info</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{address}</span>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {poolInfo && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Pool Information</h2>
            <div>
              <span className="font-semibold">Current Tick:</span>{" "}
              {poolInfo.tick}
            </div>
            <div>
              <span className="font-semibold">SqrtPriceX96:</span>{" "}
              {poolInfo.sqrtPriceX96.toString()}
            </div>
            <div>
              <span className="font-semibold">Liquidity:</span>{" "}
              {poolInfo.liquidity.toString()}
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Token Operations</h2>
          <TokenBalance />
        </div>
      </div>
    </div>
  );
}

export default App;
