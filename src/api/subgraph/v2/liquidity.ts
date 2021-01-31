import { gql } from "graphql-request";

const RESERVE_FRAGMENT = gql`
  fragment ReserveLiquidityItemV2 on Reserve {
    id
    symbol
    decimals
    totalLiquidity
    liquidityRate
    variableBorrowRate
    stableBorrowRate
    stableBorrowRateEnabled
    availableLiquidity
    # totalBorrows
    # totalBorrowsStable
    # totalBorrowsVariable
    lastUpdateTimestamp
    liquidityIndex
    variableBorrowIndex
    lifetimeFlashLoans
    lifetimeLiquidated
    # lifetimeFlashloanProtocolFee
    # lifetimeFlashloanDepositorsFee
    # lifetimeFeeOriginated
    # lifetimeFeeCollected
    underlyingAsset
    isActive
    usageAsCollateralEnabled
    borrowingEnabled
    baseLTVasCollateral
    name
    reserveLiquidationThreshold
    reserveLiquidationBonus
    utilizationRate
    optimalUtilisationRate
    reserveInterestRateStrategy
    baseVariableBorrowRate
    stableRateSlope1
    stableRateSlope2
    variableRateSlope1
    variableRateSlope2
    isFrozen
    reserveFactor
    stableDebtLastUpdateTimestamp
    averageStableRate
    totalPrincipalStableDebt
    totalScaledVariableDebt
    aToken {
      id
    }
    vToken {
      id
    }
    sToken {
      id
    }
    price {
      id
      priceInEth
    }
    pool {
      id
    }
  }
`;

const RESERVE_HISTORY_FRAGMENT = gql`
  fragment ReserveHistoryLiquidityDataV2 on ReserveParamsHistoryItem {
    id
    timestamp
    totalLiquidity
    availableLiquidity
    # totalBorrows
    # totalBorrowsStable
    # totalBorrowsVariable
    lifetimeScaledVariableDebt
    lifetimePrincipalStableDebt
    lifetimeCurrentVariableDebt
    liquidityIndex
    liquidityRate
    variableBorrowIndex
    variableBorrowRate
    priceInEth
    priceInUsd
    utilizationRate
    stableBorrowRate
    # lifetimeFlashLoans
  }
`;

export const ALL_STATS = gql`
  query ReservesLiquidityQuery($poolId: String!) {
    reserves(
      # orderBy: liquidityRate
      orderDirection: desc
      where: { pool: $poolId }
    ) {
      ...ReserveLiquidityItemV2
      #first: paramsHistory(first: 1, orderBy: timestamp, orderDirection: asc) {
      #  ...ReserveHistoryData
      #}
    }
  }

  ${RESERVE_FRAGMENT}
`;

export const RESERVE_PARAMS_HISTORY_ITEM = gql`
  query ReserveParamsHistoryLiquidityItems(
    $timeReference: Int!
    $reserve: String!
  ) {
    reserveParamsHistoryItems(
      where: { timestamp_lte: $timeReference, reserve: $reserve }
      first: 1
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...ReserveHistoryLiquidityDataV2
    }
  }
  ${RESERVE_HISTORY_FRAGMENT}
`;

export const FIRST_RESERVE_PARAMS_HISTORY_ITEM = gql`
  query FirstReserveParamsHistoryLiquidityItems($reserve: String!) {
    reserveParamsHistoryItems(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { reserve: $reserve }
    ) {
      ...ReserveHistoryLiquidityDataV2
    }
  }
  ${RESERVE_HISTORY_FRAGMENT}
`;
