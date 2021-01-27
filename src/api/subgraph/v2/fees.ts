import { gql } from "graphql-request";

const RESERVE_HISTORY_FEE_FRAGMENT = gql`
  fragment ReserveHistoryFeeData on ReserveParamsHistoryItem {
    id
    timestamp
    lifetimeFlashLoanPremium
    lifetimeReserveFactorAccrued
    lifetimeDepositorsInterestEarned
  }
`;

const RESERVE_FEE_FRAGMENT = gql`
  fragment ReserveFeeItem on Reserve {
    id
    symbol
    decimals
    lifetimeFlashLoanPremium
    lifetimeReserveFactorAccrued
    lifetimeDepositorsInterestEarned
    price {
      id
      priceInEth
    }
    pool {
      id
    }
  }
`;

export const FEES_QUERY = gql`
  query ReservesFeesQuery($oneDayAgo: Int!, $sevenDaysAgo: Int!) {
    priceOracle(id: 1) {
      id
      usdPriceEth
      lastUpdateTimestamp
    }
    reserves {
      ...ReserveFeeItem
      oneDayAgo: paramsHistory(
        orderDirection: desc
        orderBy: timestamp
        first: 1
        where: { timestamp_lte: $oneDayAgo }
      ) {
        ...ReserveHistoryFeeData
      }
      sevenDaysAgo: paramsHistory(
        orderDirection: desc
        orderBy: timestamp
        first: 1
        where: { timestamp_lte: $sevenDaysAgo }
      ) {
        ...ReserveHistoryFeeData
      }
    }
  }
  ${RESERVE_FEE_FRAGMENT}
  ${RESERVE_HISTORY_FEE_FRAGMENT}
`;
