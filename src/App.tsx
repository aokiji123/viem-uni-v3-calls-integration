import { useEffect, useState } from "react";
import "./App.css";
import { getPoolInfo } from "./viem";

function App() {
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

    fetchPoolInfo();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!poolInfo) {
    return <div className="p-4">Loading pool info...</div>;
  }

  console.log(poolInfo);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Uniswap V3 Pool Info</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Current Tick:</span> {poolInfo.tick}
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
    </div>
  );
}

export default App;
