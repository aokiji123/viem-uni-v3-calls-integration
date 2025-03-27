import { WagmiProvider as WagmiConfig } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "../config/wagmi";

type WagmiProviderProps = {
  children: React.ReactNode;
};

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  );
}
