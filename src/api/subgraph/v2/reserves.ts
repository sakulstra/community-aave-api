import { gql } from 'graphql-request';

export const RESERVES_QUERY = gql`
  query Reserves($pool: String) {
    reserves(where: { pool: $pool }) {
      id
      underlyingAsset
      name
      symbol
      decimals
      isActive
      usageAsCollateralEnabled
      borrowingEnabled
      stableBorrowRateEnabled
      baseLTVasCollateral
      liquidityIndex
      reserveLiquidationThreshold
      totalLiquidityAsCollateral
      variableBorrowIndex
      averageStableRate
      aToken {
        id
      }
      vToken {
        id
      }
      sToken {
        id
      }
      availableLiquidity
      stableBorrowRate
      liquidityRate
      totalPrincipalStableDebt
      totalScaledVariableDebt
      totalLiquidity
      utilizationRate
      reserveLiquidationBonus
      variableBorrowRate
      price {
        priceInEth
      }
      lastUpdateTimestamp
      isFrozen
      reserveFactor
      optimalUtilisationRate
      stableRateSlope1
      stableRateSlope2
      stableDebtLastUpdateTimestamp
      baseVariableBorrowRate
      variableRateSlope1
      variableRateSlope2
    }
  }
`;
