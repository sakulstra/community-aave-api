/// <reference types="next" />
/// <reference types="next/types/global" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ETHEREUM_NETWORK: "mainnet";
      MONGO_URI: string;
      RPC_PROVIDER: string;
    }
  }
}
