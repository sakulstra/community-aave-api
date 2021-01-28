import { gql } from "graphql-request";

export const PRICE_ORACLE_QUERY = gql`
  query VolumeReservesV1 {
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
  query DailyVolumeV1($first: Int!, $from: Int!) {
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
        amount: amountAfterFee
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
