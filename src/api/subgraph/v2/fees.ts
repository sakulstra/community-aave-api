import { gql } from "graphql-request";

const RESERVE_HISTORY_FEE_FRAGMENT = gql`
  fragment ReserveHistoryFeeDataV2 on ReserveParamsHistoryItem {
    id
    timestamp
    lifetimeFlashLoanPremium
    lifetimeReserveFactorAccrued
    lifetimeDepositorsInterestEarned
  }
`;

const RESERVE_FEE_FRAGMENT = gql`
  fragment ReserveFeeItemV2 on Reserve {
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
      ...ReserveFeeItemV2
      oneDayAgo: paramsHistory(
        orderDirection: desc
        orderBy: timestamp
        first: 1
        where: { timestamp_lte: $oneDayAgo }
      ) {
        ...ReserveHistoryFeeDataV2
      }
      sevenDaysAgo: paramsHistory(
        orderDirection: desc
        orderBy: timestamp
        first: 1
        where: { timestamp_lte: $sevenDaysAgo }
      ) {
        ...ReserveHistoryFeeDataV2
      }
    }
  }
  ${RESERVE_FEE_FRAGMENT}
  ${RESERVE_HISTORY_FEE_FRAGMENT}
`;
