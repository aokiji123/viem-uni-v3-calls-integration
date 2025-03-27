import { Address } from "viem";

// Example ERC20 ABI - replace with your specific contract ABI
export const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export type ContractConfig = {
  address: Address;
  abi: typeof ERC20_ABI;
};

// Replace these addresses with your actual contract addresses
export const CONTRACTS = {
  USDC: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address, // Mainnet USDC
    abi: ERC20_ABI,
  },
} as const;
