import { gql } from "graphql-request";

export const RESERVES_QUERY = gql`
  query Oracle {
    priceOracle(id: 1) {
      id
      usdPriceEth
      lastUpdateTimestamp
    }
  }
`;
