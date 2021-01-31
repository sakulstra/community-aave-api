/// <reference types="next" />
/// <reference types="next/types/global" />

import { EthereumNetwork } from "@api/enums";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ETHEREUM_NETWORK: EthereumNetwork;
      MONGO_URI: string;
      RPC_PROVIDER: string;
    }
  }
}
