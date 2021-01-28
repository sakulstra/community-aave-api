import { normalize, valueToZDBigNumber } from "@aave/protocol-js";
import { gqlSdkV2, gqlSdkV1 } from "@api/subgraph";
import { applyCacheHeaders } from "@api/utils/responseHelpers";
import BigNumber from "bignumber.js";
import { NextApiRequest, NextApiResponse } from "next";

const USD_DECIMALS = 10;
const DEFAULT_PAGE_SIZE = 1000;

export async function timestampPaginateAll<
  V extends { from: number; first: number },
  T extends { items: { timestamp: number; id: string }[] }
>(
  fetcher: (variables: V, requestHeaders?: Headers) => Promise<{ data?: T }>,
  variables: V
): Promise<T["items"]> {
  let result;
  try {
    result = await fetcher({
      ...variables,
      first: variables.first || DEFAULT_PAGE_SIZE,
      from: variables.from,
    });
  } catch (e) {
    // this might just happened as thegraph isn't very reliable, so we just process what we got until now
    // eslint-disable-next-line no-console
    console.error("graph errored", e);
    return [];
  }
  if (result.data?.items.length === (variables.first || DEFAULT_PAGE_SIZE)) {
    return [
      ...result.data.items,
      ...(await timestampPaginateAll(fetcher, {
        ...variables,
        first: variables.first || DEFAULT_PAGE_SIZE,
        from: result.data.items[result.data.items.length - 1].timestamp,
      })),
    ];
  }
  return result.data?.items || [];
}

const getBalanceUsd = (amount, reserve, usdPriceEth) => {
  const balanceInEth = valueToZDBigNumber(amount)
    .multipliedBy(reserve.price.priceInEth)
    .dividedBy(10 ** reserve.decimals);

  return balanceInEth.multipliedBy(10 ** USD_DECIMALS).dividedBy(usdPriceEth);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  applyCacheHeaders(res, 60, false);
  const oneDayInSeconds = 24 * 60 * 60;
  const currentTimestamp = Math.round(new Date().getTime() / 1000);
  const oneDayAgoTimestamp = currentTimestamp - oneDayInSeconds;
  const [reservesV1, reservesV2, txsV1, txsV2] = await Promise.all([
    gqlSdkV1.VolumeReservesV1(),
    gqlSdkV2.VolumeReservesV2(),
    timestampPaginateAll(gqlSdkV1.DailyVolumeV1, {
      from: oneDayAgoTimestamp,
      first: 1000,
    }),
    timestampPaginateAll(gqlSdkV2.DailyVolumeV2, {
      from: oneDayAgoTimestamp,
      first: 1000,
    }),
  ]);
  const usdPriceEth = reservesV1.data.priceOracle.usdPriceEth;
  const v1Volume = txsV1.reduce((acc, tx) => {
    if (
      tx.__typename === "Borrow" ||
      tx.__typename === "Repay" ||
      tx.__typename === "RedeemUnderlying" ||
      tx.__typename === "Deposit"
    ) {
      const reserve = reservesV1.data.reserves.find(
        (reserve) => reserve.id === tx.reserve.id
      );
      return acc.plus(getBalanceUsd(tx.amount, reserve, usdPriceEth));
    }
    return acc;
  }, new BigNumber(0));

  const v2Volume = txsV2.reduce((acc, tx) => {
    if (
      tx.__typename === "Borrow" ||
      tx.__typename === "Repay" ||
      tx.__typename === "RedeemUnderlying" ||
      tx.__typename === "Deposit"
    ) {
      const reserve = reservesV2.data.reserves.find(
        (reserve) => reserve.id === tx.reserve.id
      );
      return acc.plus(getBalanceUsd(tx.amount, reserve, usdPriceEth));
    }
    return acc;
  }, new BigNumber(0));

  const response = {
    v1: normalize(v1Volume, USD_DECIMALS),
    v2: normalize(v2Volume, USD_DECIMALS),
    total: normalize(v1Volume.plus(v2Volume), USD_DECIMALS),
  };
  res.json(JSON.stringify(response));
};
