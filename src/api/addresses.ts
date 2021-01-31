import { EthereumNetwork, AavePool, Version } from "./enums";

export const ADDRESSES = {
  GRAPH: {
    [Version.V1]: {
      [EthereumNetwork.kovan]:
        "https://api.thegraph.com/subgraphs/name/aave/protocol-multy-kovan-raw",
      [EthereumNetwork.ropsten]:
        "https://api.thegraph.com/subgraphs/name/aave/protocol-multy-ropsten-raw",
      [EthereumNetwork.main]:
        "https://api.thegraph.com/subgraphs/name/aave/protocol-multy-raw",
    },
    [Version.V2]: {
      [EthereumNetwork.kovan]:
        "https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan",
      [EthereumNetwork.ropsten]:
        "https://api.thegraph.com/subgraphs/name/aave/protocol-v2-ropsten",
      [EthereumNetwork.main]:
        "https://api.thegraph.com/subgraphs/name/aave/protocol-v2",
    },
  },
  ADDRESS_PROVIDER_ADDRESS: {
    [Version.V1]: {
      [AavePool.proto]: {
        [EthereumNetwork.kovan]: "0x506b0b2cf20faa8f38a4e2b524ee43e1f4458cc5",
        [EthereumNetwork.ropsten]: "0x1c8756fd2b28e9426cdbdcc7e3c4d64fa9a54728",
        [EthereumNetwork.main]: "0x24a42fd28c976a61df5d00d0599c34c4f90748c8",
      },
      [AavePool.uniswap]: {
        [EthereumNetwork.kovan]: "0xc786e9443f02817D9a09268C9E0918A54a8B25C1",
        [EthereumNetwork.ropsten]: "0x830853d3B904128A475CB663D9080Bc0678C4248",
        [EthereumNetwork.main]: "0x7fd53085b9a29d236235d6fc593b47c9c33429f1",
      },
    },
    [Version.V2]: {
      [AavePool.proto]: {
        [EthereumNetwork.kovan]: "0x88757f2f99175387ab4c6a4b3067c77a695b0349",
        [EthereumNetwork.ropsten]: "",
        [EthereumNetwork.main]: "0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
      },
    },
  },
} as const;
