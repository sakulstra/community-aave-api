import { gql } from "graphql-request";

export const USER_RESERVES_QUERY = gql`
  query UserReserves($pool: String!, $first: Int!, $from: Int!) {
    items: userReserves(
      first: $first
      orderBy: lastUpdateTimestamp
      where: { lastUpdateTimestamp_gte: $from, pool: $pool }
    ) {
      id
      principalATokenBalance
      userBalanceIndex
      redirectedBalance
      interestRedirectionAddress
      reserve {
        id
        underlyingAsset
        name
        symbol
        decimals
        liquidityRate
        usageAsCollateralEnabled
        reserveLiquidationBonus
        lastUpdateTimestamp
        aToken {
          id
        }
      }
      usageAsCollateralEnabledOnUser
      borrowRate
      borrowRateMode
      originationFee
      principalBorrows
      variableBorrowIndex
      lastUpdateTimestamp
      user {
        id
      }
    }
  }
`;
