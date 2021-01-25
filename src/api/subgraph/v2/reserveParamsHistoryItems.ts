import { gql } from "graphql-request";

const RESERVE_HISTORY_FRAGMENT = gql`
  fragment ReserveHistoryData on ReserveParamsHistoryItem {
    id
    timestamp
    totalLiquidity
    availableLiquidity
    liquidityIndex
    variableBorrowIndex
    priceInEth
    priceInUsd
    totalScaledVariableDebt
    totalPrincipalStableDebt
    averageStableBorrowRate
  }
`;

export const HISTORY_RESERVE_QUERY = gql`
  query ReserveParamsHistory($reference: Int!, $reserve: String!) {
    reference: reserveParamsHistoryItems(
      where: { timestamp_lte: $reference, reserve: $reserve }
      first: 1
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ReserveHistoryData
    }
  }
  ${RESERVE_HISTORY_FRAGMENT}
`;

export const FIRST_HISTORY_RESERVE_QUERY = gql`
  query FirstReserveParamsHistory($reserve: String!) {
    reference: reserveParamsHistoryItems(
      where: { reserve: $reserve }
      first: 1
      orderBy: timestamp
      orderDirection: asc
    ) {
      ...ReserveHistoryData
    }
  }
  ${RESERVE_HISTORY_FRAGMENT}
`;
