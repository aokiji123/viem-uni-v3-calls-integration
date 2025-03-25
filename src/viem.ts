import { createPublicClient, http, getContract } from "viem";
import { mainnet } from "viem/chains";

// Uniswap V3 Factory ABI
const UNISWAP_V3_FACTORY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
    ],
    name: "getPool",
    outputs: [{ internalType: "address", name: "pool", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Uniswap V3 Pool ABI
const UNISWAP_V3_POOL_ABI = [
  {
    inputs: [],
    name: "slot0",
    outputs: [
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
      { internalType: "int24", name: "tick", type: "int24" },
      { internalType: "uint16", name: "observationIndex", type: "uint16" },
      {
        internalType: "uint16",
        name: "observationCardinality",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "observationCardinalityNext",
        type: "uint16",
      },
      { internalType: "uint8", name: "feeProtocol", type: "uint8" },
      { internalType: "bool", name: "unlocked", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidity",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Contract addresses
const UNISWAP_V3_FACTORY =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984" as const;
const USDC_ETH_POOL = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8" as const; // USDC/ETH Pool (0.3% fee tier)

const client = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.llamarpc.com"), // Using LlamaNodes public RPC
});

// Create contract instances
export const factoryContract = getContract({
  address: UNISWAP_V3_FACTORY,
  abi: UNISWAP_V3_FACTORY_ABI,
  client,
});

export const poolContract = getContract({
  address: USDC_ETH_POOL,
  abi: UNISWAP_V3_POOL_ABI,
  client,
});

// Test functions
export async function getPoolInfo() {
  try {
    const [slot0, liquidity] = await Promise.all([
      poolContract.read.slot0(),
      poolContract.read.liquidity(),
    ]);

    return {
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
      liquidity: liquidity,
    };
  } catch (error) {
    console.error("Error fetching pool info:", error);
    throw error;
  }
}

export async function getPoolAddress(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  fee: number
) {
  try {
    const poolAddress = await factoryContract.read.getPool([
      tokenA,
      tokenB,
      fee,
    ]);
    return poolAddress;
  } catch (error) {
    console.error("Error fetching pool address:", error);
    throw error;
  }
}
