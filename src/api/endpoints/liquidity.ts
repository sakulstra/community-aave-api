import { normalize, v2, calculateAverageRate, v1 } from "@aave/protocol-js";
import { ADDRESSES } from "@api/addresses";
import { Version } from "@api/enums";
import { gqlSdkV1, gqlSdkV2 } from "@api/subgraph";
import { ReserveHistoryLiquidityDataV2Fragment } from "@api/subgraph/v2Client";
import { ReserveHistoryLiquidityDataV1Fragment } from "@api/subgraph/v1Client";
import BigNumber from "bignumber.js";

const getFilterDates = (timeStamp: number) => {
  return {
    h1_ago: timeStamp - 60 * 60,
    d1_ago: timeStamp - 24 * 60 * 60,
    d7_ago: timeStamp - 7 * 24 * 60 * 60,
    d30_ago: timeStamp - 30 * 24 * 60 * 60,
    d91_ago: timeStamp - 91 * 24 * 60 * 60,
    d365_ago: timeStamp - 365 * 24 * 60 * 60,
  };
};

const getAverageRates = <T extends string>(
  name: T,
  previousReserve:
    | ReserveHistoryLiquidityDataV2Fragment
    | ReserveHistoryLiquidityDataV1Fragment,
  currentReserve:
    | ReserveHistoryLiquidityDataV2Fragment
    | ReserveHistoryLiquidityDataV1Fragment
) => {
  return {
    [`${name}VariableBorrowRate`]:
      previousReserve && currentReserve
        ? calculateAverageRate(
            previousReserve.variableBorrowIndex,
            currentReserve.variableBorrowIndex,
            previousReserve.timestamp,
            currentReserve.timestamp
          )
        : "0",
    [`${name}LiquidityRate`]:
      previousReserve && currentReserve
        ? calculateAverageRate(
            previousReserve.liquidityIndex,
            currentReserve.liquidityIndex,
            previousReserve.timestamp,
            currentReserve.timestamp
          )
        : "0",
  } as {
    [K in T as `${K}VariableBorrowRate` | `${K}LiquidityRate`]: string;
  };
};

const getFormattedReserveHistoryV2 = <T extends string>(
  name: T,
  reserve: ReserveHistoryLiquidityDataV2Fragment,
  decimals: number
) => {
  return {
    [`totalLiquidityNormalized${name}`]: reserve?.totalLiquidity
      ? normalize(reserve.totalLiquidity, decimals)
      : 0,
    [`totalBorrowsNormalized${name}`]: reserve?.lifetimePrincipalStableDebt
      ? normalize(
          new BigNumber(reserve.lifetimePrincipalStableDebt)
            .plus(reserve.lifetimeScaledVariableDebt)
            .toString(),
          decimals
        )
      : 0,
    [`totalBorrowsStableNormalized${name}`]: reserve?.lifetimePrincipalStableDebt
      ? normalize(reserve.lifetimePrincipalStableDebt, decimals)
      : 0,
    [`totalBorrowsVariableNormalized${name}`]: reserve?.lifetimeScaledVariableDebt
      ? normalize(reserve.lifetimeScaledVariableDebt, decimals)
      : 0,
    [`availableLiquidityNormalized${name}`]: reserve?.availableLiquidity
      ? normalize(reserve.availableLiquidity, decimals)
      : 0,
  } as {
    [K in T as
      | `totalLiquidityNormalized${K}`
      | `totalBorrowsNormalized${K}`
      | `availableLiquidityNormalized${K}`]: string;
  };
};

const getFormattedReserveHistoryV1 = <T extends string>(
  name: T,
  reserve: ReserveHistoryLiquidityDataV1Fragment,
  decimals: number
) => {
  return {
    [`totalLiquidityNormalized${name}`]: reserve?.totalLiquidity
      ? normalize(reserve.totalLiquidity, decimals)
      : 0,
    [`totalBorrowsNormalized${name}`]: reserve?.totalBorrows
      ? normalize(reserve.totalBorrows, decimals)
      : 0,
    [`totalBorrowsStableNormalized${name}`]: reserve?.totalBorrowsStable
      ? normalize(reserve.totalBorrowsStable, decimals)
      : 0,
    [`totalBorrowsVariableNormalized${name}`]: reserve?.totalBorrowsVariable
      ? normalize(reserve.totalBorrowsVariable, decimals)
      : 0,
    [`availableLiquidityNormalized${name}`]: reserve?.availableLiquidity
      ? normalize(reserve.availableLiquidity, decimals)
      : 0,
  } as {
    [K in T as
      | `totalLiquidityNormalized${K}`
      | `totalBorrowsNormalized${K}`
      | `availableLiquidityNormalized${K}`]: string;
  };
};

export async function fetchProtocolStatsV2(timestamp: number, poolId: string) {
  const referenceDates = getFilterDates(timestamp);
  const { data } = await gqlSdkV2.ReservesLiquidityQuery({ poolId });
  return Promise.all(
    v2
      .formatReserves(
        data.reserves.map((reserve) => ({
          ...reserve,
          aTokenAddress: reserve.aToken.id,
          stableDebtTokenAddress: reserve.sToken.id,
          variableDebtTokenAddress: reserve.vToken.id,
        })),
        timestamp
      )
      .map(async (reserve, ix) => {
        const results = await Promise.all([
          gqlSdkV2.ReserveParamsHistoryLiquidityItems({
            timeReference: timestamp,
            reserve: reserve.id,
          }),
          gqlSdkV2.ReserveParamsHistoryLiquidityItems({
            timeReference: referenceDates.d1_ago,
            reserve: reserve.id,
          }),
          gqlSdkV2.ReserveParamsHistoryLiquidityItems({
            timeReference: referenceDates.d7_ago,
            reserve: reserve.id,
          }),
          gqlSdkV2.ReserveParamsHistoryLiquidityItems({
            timeReference: referenceDates.d30_ago,
            reserve: reserve.id,
          }),
          gqlSdkV2.ReserveParamsHistoryLiquidityItems({
            timeReference: referenceDates.d91_ago,
            reserve: reserve.id,
          }),
          gqlSdkV2.ReserveParamsHistoryLiquidityItems({
            timeReference: referenceDates.d365_ago,
            reserve: reserve.id,
          }),
          gqlSdkV2.FirstReserveParamsHistoryLiquidityItems({
            reserve: reserve.id,
          }),
        ]);
        const decimals = data.reserves[ix].decimals;
        const current = results[0].data.reserveParamsHistoryItems[0] ?? null;
        const ago1d = results[1].data.reserveParamsHistoryItems[0] ?? null;
        const ago7d = results[2].data.reserveParamsHistoryItems[0] ?? null;
        const ago30d = results[3].data.reserveParamsHistoryItems[0] ?? null;
        const ago91d = results[4].data.reserveParamsHistoryItems[0] ?? null;
        const ago365d = results[5].data.reserveParamsHistoryItems[0] ?? null;
        const inception = results[6].data.reserveParamsHistoryItems[0] ?? null;
        return {
          ...reserve,
          ...getAverageRates<"avg1Days">("avg1Days", ago1d, current),
          ...getAverageRates<"avg7Days">("avg7Days", ago7d, current),
          ...getAverageRates<"avg30Days">("avg30Days", ago30d, current),
          ...getAverageRates<"avg91Days">("avg91Days", ago91d, current),
          ...getAverageRates<"avg365Days">("avg365Days", ago365d, current),
          ...getAverageRates<"inception">("inception", inception, current),
          ...getFormattedReserveHistoryV2<"">("", current, decimals),
          ...getFormattedReserveHistoryV2<"1DaysAgo">(
            "1DaysAgo",
            ago1d,
            decimals
          ),
          ...getFormattedReserveHistoryV2<"7DaysAgo">(
            "7DaysAgo",
            ago7d,
            decimals
          ),
          ...getFormattedReserveHistoryV2<"30DaysAgo">(
            "30DaysAgo",
            ago30d,
            decimals
          ),
          ...getFormattedReserveHistoryV2<"91DaysAgo">(
            "91DaysAgo",
            ago91d,
            decimals
          ),
          ...getFormattedReserveHistoryV2<"365DaysAgo">(
            "365DaysAgo",
            ago365d,
            decimals
          ),
          current: {
            ...current,
            liquidityRate: current
              ? new BigNumber(current.liquidityRate).div(10 ** 27).toString()
              : "0",
            variableBorrowRate: current
              ? new BigNumber(current.variableBorrowRate)
                  .div(10 ** 27)
                  .toString()
              : "0",
            stableBorrowRate: current
              ? new BigNumber(current.stableBorrowRate).div(10 ** 27).toString()
              : "0",
          },
          baseVariableBorrowRate: new BigNumber(reserve.baseVariableBorrowRate)
            .div(10 ** 27)
            .toString(),
          variableRateSlope1: new BigNumber(reserve.variableRateSlope1)
            .div(10 ** 27)
            .toString(),
          variableRateSlope2: new BigNumber(reserve.variableRateSlope2)
            .div(10 ** 27)
            .toString(),
          stableRateSlope1: new BigNumber(reserve.stableRateSlope1)
            .div(10 ** 27)
            .toString(),
          stableRateSlope2: new BigNumber(reserve.stableRateSlope2)
            .div(10 ** 27)
            .toString(),
          optimalUtilisationRate: new BigNumber(reserve.optimalUtilisationRate)
            .div(10 ** 27)
            .toString(),
          stableDebtTokenAddress: data.reserves[ix].sToken.id,
          variableDebtTokenAddress: data.reserves[ix].vToken.id,
          inception,
        };
      })
  );
}

export async function fetchProtocolStatsV1(timestamp: number, poolId: string) {
  const referenceDates = getFilterDates(timestamp);
  const { data } = await gqlSdkV1.ReservesLiquidityQuery({ poolId });
  return Promise.all(
    v1.formatReserves(data.reserves).map(async (reserve, ix) => {
      const results = await Promise.all([
        gqlSdkV1.ReserveParamsHistoryLiquidityItems({
          timeReference: timestamp,
          reserve: reserve.id,
        }),
        gqlSdkV1.ReserveParamsHistoryLiquidityItems({
          timeReference: referenceDates.d1_ago,
          reserve: reserve.id,
        }),
        gqlSdkV1.ReserveParamsHistoryLiquidityItems({
          timeReference: referenceDates.d7_ago,
          reserve: reserve.id,
        }),
        gqlSdkV1.ReserveParamsHistoryLiquidityItems({
          timeReference: referenceDates.d30_ago,
          reserve: reserve.id,
        }),
        gqlSdkV1.ReserveParamsHistoryLiquidityItems({
          timeReference: referenceDates.d91_ago,
          reserve: reserve.id,
        }),
        gqlSdkV1.ReserveParamsHistoryLiquidityItems({
          timeReference: referenceDates.d365_ago,
          reserve: reserve.id,
        }),
        gqlSdkV1.FirstReserveParamsHistoryLiquidityItems({
          reserve: reserve.id,
        }),
      ]);
      const decimals = data.reserves[ix].decimals;
      const current = results[0].data.reserveParamsHistoryItems[0] ?? null;
      const ago1d = results[1].data.reserveParamsHistoryItems[0] ?? null;
      const ago7d = results[2].data.reserveParamsHistoryItems[0] ?? null;
      const ago30d = results[3].data.reserveParamsHistoryItems[0] ?? null;
      const ago91d = results[4].data.reserveParamsHistoryItems[0] ?? null;
      const ago365d = results[5].data.reserveParamsHistoryItems[0] ?? null;
      const inception = results[6].data.reserveParamsHistoryItems[0] ?? null;
      return {
        ...reserve,
        ...getAverageRates<"avg1Days">("avg1Days", ago1d, current),
        ...getAverageRates<"avg7Days">("avg7Days", ago7d, current),
        ...getAverageRates<"avg30Days">("avg30Days", ago30d, current),
        ...getAverageRates<"avg91Days">("avg91Days", ago91d, current),
        ...getAverageRates<"avg365Days">("avg365Days", ago365d, current),
        ...getAverageRates<"inception">("inception", inception, current),
        ...getFormattedReserveHistoryV1<"">("", current, decimals),
        ...getFormattedReserveHistoryV1<"1DaysAgo">(
          "1DaysAgo",
          ago1d,
          decimals
        ),
        ...getFormattedReserveHistoryV1<"7DaysAgo">(
          "7DaysAgo",
          ago7d,
          decimals
        ),
        ...getFormattedReserveHistoryV1<"30DaysAgo">(
          "30DaysAgo",
          ago30d,
          decimals
        ),
        ...getFormattedReserveHistoryV1<"91DaysAgo">(
          "91DaysAgo",
          ago91d,
          decimals
        ),
        ...getFormattedReserveHistoryV1<"365DaysAgo">(
          "365DaysAgo",
          ago365d,
          decimals
        ),
        current: {
          ...current,
          liquidityRate: current
            ? new BigNumber(current.liquidityRate).div(10 ** 27).toString()
            : "0",
          variableBorrowRate: current
            ? new BigNumber(current.variableBorrowRate).div(10 ** 27).toString()
            : "0",
          stableBorrowRate: current
            ? new BigNumber(current.stableBorrowRate).div(10 ** 27).toString()
            : "0",
        },
        baseVariableBorrowRate: new BigNumber(reserve.baseVariableBorrowRate)
          .div(10 ** 27)
          .toString(),
        variableRateSlope1: new BigNumber(reserve.variableRateSlope1)
          .div(10 ** 27)
          .toString(),
        variableRateSlope2: new BigNumber(reserve.variableRateSlope2)
          .div(10 ** 27)
          .toString(),
        stableRateSlope1: new BigNumber(reserve.stableRateSlope1)
          .div(10 ** 27)
          .toString(),
        stableRateSlope2: new BigNumber(reserve.stableRateSlope2)
          .div(10 ** 27)
          .toString(),
        optimalUtilisationRate: new BigNumber(reserve.optimalUtilisationRate)
          .div(10 ** 27)
          .toString(),
        inception,
      };
    })
  );
}

export async function fetchV2(poolId?: string, timestamp?: number) {
  const ts = timestamp || Math.floor(new Date().getTime() / 1000);
  if (poolId) {
    return fetchProtocolStatsV2(ts, poolId);
  } else {
    const pools = await Promise.all(
      Object.values(
        ADDRESSES.ADDRESS_PROVIDER_ADDRESS[Version.V2]
      ).map((pool) =>
        fetchProtocolStatsV2(ts, pool[process.env.ETHEREUM_NETWORK])
      )
    );
    return pools.flat();
  }
}

export async function fetchV1(poolId?: string, timestamp?: number) {
  const ts = timestamp || Math.floor(new Date().getTime() / 1000);
  if (poolId) {
    return fetchProtocolStatsV1(ts, poolId);
  } else {
    const pools = await Promise.all(
      Object.values(
        ADDRESSES.ADDRESS_PROVIDER_ADDRESS[Version.V1]
      ).map((pool) =>
        fetchProtocolStatsV1(ts, pool[process.env.ETHEREUM_NETWORK])
      )
    );
    return pools.flat();
  }
}
