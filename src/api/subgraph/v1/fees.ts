import { gql } from "graphql-request";

const RESERVE_HISTORY_FEE_FRAGMENT = gql`
  fragment ReserveHistoryFeeDataV1 on ReserveParamsHistoryItem {
    id
    timestamp
    lifetimeFlashloanDepositorsFee
    lifetimeFlashloanProtocolFee
    lifetimeOriginationFee
    lifetimeDepositorsInterestEarned
  }
`;

const RESERVE_FEE_FRAGMENT = gql`
  fragment ReserveFeeItemV1 on Reserve {
    id
    symbol
    decimals
    lifetimeFlashloanDepositorsFee
    lifetimeFlashloanProtocolFee
    lifetimeOriginationFee: lifetimeFeeOriginated
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
      ...ReserveFeeItemV1
      oneDayAgo: paramsHistory(
        orderDirection: desc
        orderBy: timestamp
        first: 1
        where: { timestamp_lte: $oneDayAgo }
      ) {
        ...ReserveHistoryFeeDataV1
      }
      sevenDaysAgo: paramsHistory(
        orderDirection: desc
        orderBy: timestamp
        first: 1
        where: { timestamp_lte: $sevenDaysAgo }
      ) {
        ...ReserveHistoryFeeDataV1
      }
    }
  }
  ${RESERVE_FEE_FRAGMENT}
  ${RESERVE_HISTORY_FEE_FRAGMENT}
`;
