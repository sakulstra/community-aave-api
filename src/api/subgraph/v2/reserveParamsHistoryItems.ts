import { gql } from "graphql-request";

const RESERVE_HISTORY_FRAGMENT = gql`
  fragment ReserveHistoryDataV2 on ReserveParamsHistoryItem {
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
      ...ReserveHistoryDataV2
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
      ...ReserveHistoryDataV2
    }
  }
  ${RESERVE_HISTORY_FRAGMENT}
`;
