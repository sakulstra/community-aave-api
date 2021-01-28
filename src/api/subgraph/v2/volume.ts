import { gql } from "graphql-request";

export const PRICE_ORACLE_QUERY = gql`
  query VolumeReservesV2 {
    priceOracle(id: 1) {
      usdPriceEth
    }
    reserves {
      id
      symbol
      name
      decimals
      underlyingAsset
      price {
        priceInEth
      }
      aToken {
        id
      }
    }
  }
`;

export const DAILY_VOLUME_QUERY = gql`
  query DailyVolumeV2($first: Int!, $from: Int!) {
    items: userTransactions(
      first: $first
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gte: $from }
    ) {
      __typename
      id
      timestamp
      ... on Repay {
        reserve {
          id
        }
        amount
      }
      ... on Deposit {
        reserve {
          id
        }
        amount
      }
      ... on Borrow {
        reserve {
          id
        }
        amount
      }
      ... on RedeemUnderlying {
        reserve {
          id
        }
        amount
      }
    }
  }
`;
