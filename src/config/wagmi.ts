import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
