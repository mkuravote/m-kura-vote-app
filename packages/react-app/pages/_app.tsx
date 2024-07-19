import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { AppProps } from "next/app";
import { createConfig, http, WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";

import Layout from "../components/Layout";
import { ClientContext, GraphQLClient } from "graphql-hooks";
import memCache from "graphql-hooks-memcache";
import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new GraphQLClient({
  cache: memCache({
    ttl: 10000,
  }),
  url:
    process.env.NEXT_PUBLIC_SNAPSHOT_GRAPHQL_API ||
    "https://hub.snapshot.org/graphql",
});

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet,
        walletConnectWallet,
        trustWallet,
        metaMaskWallet,
        coinbaseWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: "M-KuraVote",
    projectId,
  },
);

const config = createConfig({
  connectors,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const appInfo = {
  appName: "M-KuraVote",
};

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <ClientContext.Provider value={client}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClientContext.Provider>
  );
}

export default App;
