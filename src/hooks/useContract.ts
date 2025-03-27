import { useCallback } from "react";
import {
  ContractFunctionExecutionError,
  Address,
  Abi,
  AbiFunction,
} from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { ContractConfig } from "../config/contracts";

type ContractFunctionName<T> = T extends { abi: readonly (infer U)[] }
  ? U extends AbiFunction
    ? U["name"]
    : never
  : never;

type ContractFunctionArgs<
  T extends ContractConfig,
  TFunctionName extends ContractFunctionName<T>
> = Extract<
  T["abi"][number],
  { name: TFunctionName }
>["inputs"] extends readonly (infer U)[]
  ? U[]
  : never;

export function useContract<T extends ContractConfig>(contract: T) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const read = useCallback(
    async <TFunctionName extends ContractFunctionName<T>>(
      functionName: TFunctionName,
      args: ContractFunctionArgs<T, TFunctionName>
    ) => {
      if (!publicClient) {
        return { data: null, error: "Public client not initialized" };
      }

      try {
        const result = await publicClient.readContract({
          address: contract.address as Address,
          abi: contract.abi as Abi,
          functionName,
          args,
        });
        return { data: result, error: null };
      } catch (e) {
        const error = e as ContractFunctionExecutionError;
        return {
          data: null,
          error: error.message || "Contract read failed",
        };
      }
    },
    [publicClient, contract]
  );

  const write = useCallback(
    async <TFunctionName extends ContractFunctionName<T>>(
      functionName: TFunctionName,
      args: ContractFunctionArgs<T, TFunctionName>
    ) => {
      if (!walletClient || !publicClient) {
        return {
          data: null,
          error: "Wallet not connected or public client not initialized",
        };
      }

      try {
        const { request } = await publicClient.simulateContract({
          address: contract.address as Address,
          abi: contract.abi as Abi,
          functionName,
          args,
          account: walletClient.account.address,
        });

        const hash = await walletClient.writeContract(request);
        return { data: hash, error: null };
      } catch (e) {
        const error = e as ContractFunctionExecutionError;
        return {
          data: null,
          error: error.message || "Contract write failed",
        };
      }
    },
    [publicClient, walletClient, contract]
  );

  return { read, write };
}
