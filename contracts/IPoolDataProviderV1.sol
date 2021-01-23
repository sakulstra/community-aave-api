/**
 *Submitted for verification at Etherscan.io on 2020-11-03
*/

// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;


interface IPoolDataProvider {
  struct ReserveData {
    address underlyingAsset;
    string name;
    string symbol;
    uint8 decimals;
    bool isActive;
    bool isFreezed;
    bool usageAsCollateralEnabled;
    bool borrowingEnabled;
    bool stableBorrowRateEnabled;
    uint256 baseLTVasCollateral;
    uint256 averageStableBorrowRate;
    uint256 liquidityIndex;
    uint256 reserveLiquidationThreshold;
    uint256 reserveLiquidationBonus;
    uint256 variableBorrowIndex;
    uint256 variableBorrowRate;
    uint256 availableLiquidity;
    uint256 stableBorrowRate;
    uint256 liquidityRate;
    uint256 totalBorrowsStable;
    uint256 totalBorrowsVariable;
    uint256 totalLiquidity;
    uint256 utilizationRate;
    uint40 lastUpdateTimestamp;
    uint256 priceInEth;
    address aTokenAddress;
  }

  function getReservesData(address provider)
    external
    view
    returns (ReserveData[] memory, uint256);
}