import { normalize, valueToZDBigNumber } from "@aave/protocol-js";
import { gqlSdkV2, gqlSdkV1 } from "@api/subgraph";
import { ReserveHistoryFeeDataV1Fragment } from "@api/subgraph/v1Client";
import { ReserveHistoryFeeDataV2Fragment } from "@api/subgraph/v2Client";
import { applyCacheHeaders } from "@api/utils/responseHelpers";
import BigNumber from "bignumber.js";
import { NextApiRequest, NextApiResponse } from "next";

const USD_DECIMALS = 10;

const getBalanceUsd = (amount, reserve, usdPriceEth) => {
  const balanceInEth = valueToZDBigNumber(amount)
    .multipliedBy(reserve.price.priceInEth)
    .dividedBy(10 ** reserve.decimals);

  return balanceInEth.multipliedBy(10 ** USD_DECIMALS).dividedBy(usdPriceEth);
};

async function getV2Fees(
  oneDayAgoTimestamp: number,
  sevenDaysAgoTimestamp: number
) {
  const response = await gqlSdkV2.ReservesFeesQuery({
    oneDayAgo: oneDayAgoTimestamp,
    sevenDaysAgo: sevenDaysAgoTimestamp,
  });
  const usdPriceEth = response.data.priceOracle.usdPriceEth;
  return response.data?.reserves.reduce(
    (acc, reserve) => {
      const getFees = ({
        lifetimeDepositorsInterestEarned,
        lifetimeFlashLoanPremium,
        lifetimeReserveFactorAccrued,
      }: Pick<
        ReserveHistoryFeeDataV2Fragment,
        | "lifetimeDepositorsInterestEarned"
        | "lifetimeFlashLoanPremium"
        | "lifetimeReserveFactorAccrued"
      >) => {
        return getBalanceUsd(
          lifetimeDepositorsInterestEarned,
          reserve,
          usdPriceEth
        )
          .plus(getBalanceUsd(lifetimeFlashLoanPremium, reserve, usdPriceEth))
          .plus(
            getBalanceUsd(lifetimeReserveFactorAccrued, reserve, usdPriceEth)
          );
      };

      const currentFee = getFees(reserve);
      const oneDayAgoFee = getFees(reserve.oneDayAgo[0]);
      const sevenDayAgoFee = getFees(reserve.sevenDaysAgo[0]);

      acc.sevenDaysAVG = acc.sevenDaysAVG.plus(
        currentFee.minus(sevenDayAgoFee).div(7)
      );
      acc.oneDayAgo = acc.oneDayAgo.plus(currentFee.minus(oneDayAgoFee));
      return acc;
    },
    { oneDayAgo: new BigNumber(0), sevenDaysAVG: new BigNumber(0) }
  );
}

async function getV1Fees(
  oneDayAgoTimestamp: number,
  sevenDaysAgoTimestamp: number
) {
  const response = await gqlSdkV1.ReservesFeesQuery({
    oneDayAgo: oneDayAgoTimestamp,
    sevenDaysAgo: sevenDaysAgoTimestamp,
  });
  const usdPriceEth = response.data.priceOracle.usdPriceEth;
  return response.data?.reserves.reduce(
    (acc, reserve) => {
      const getFees = ({
        lifetimeFlashloanDepositorsFee,
        lifetimeFlashloanProtocolFee,
        lifetimeOriginationFee,
        lifetimeDepositorsInterestEarned,
      }: Pick<
        ReserveHistoryFeeDataV1Fragment,
        | "lifetimeFlashloanDepositorsFee"
        | "lifetimeFlashloanProtocolFee"
        | "lifetimeOriginationFee"
        | "lifetimeDepositorsInterestEarned"
      >) => {
        return getBalanceUsd(
          lifetimeDepositorsInterestEarned,
          reserve,
          usdPriceEth
        )
          .plus(
            getBalanceUsd(lifetimeFlashloanDepositorsFee, reserve, usdPriceEth)
          )
          .plus(
            getBalanceUsd(lifetimeFlashloanProtocolFee, reserve, usdPriceEth)
          )
          .plus(getBalanceUsd(lifetimeOriginationFee, reserve, usdPriceEth));
      };

      const currentFee = getFees(reserve);
      const oneDayAgoFee = getFees(reserve.oneDayAgo[0]);
      const sevenDayAgoFee = getFees(reserve.sevenDaysAgo[0]);

      acc.sevenDaysAVG = acc.sevenDaysAVG.plus(
        currentFee.minus(sevenDayAgoFee).div(7)
      );
      acc.oneDayAgo = acc.oneDayAgo.plus(currentFee.minus(oneDayAgoFee));
      return acc;
    },
    { oneDayAgo: new BigNumber(0), sevenDaysAVG: new BigNumber(0) }
  );
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  applyCacheHeaders(res, 60, false);
  const oneDayInSeconds = 24 * 60 * 60;
  const currentTimestamp = Math.round(new Date().getTime() / 1000);
  const oneDayAgoTimestamp = currentTimestamp - oneDayInSeconds;
  const sevenDaysAgoTimestamp = currentTimestamp - 7 * oneDayInSeconds;

  const feeV1 = await getV1Fees(oneDayAgoTimestamp, sevenDaysAgoTimestamp);
  const feeV2 = await getV2Fees(oneDayAgoTimestamp, sevenDaysAgoTimestamp);

  const response = {
    v1: {
      oneDayAgo: normalize(feeV1.oneDayAgo, USD_DECIMALS),
      sevenDaysAVG: normalize(feeV1.sevenDaysAVG, USD_DECIMALS),
    },
    v2: {
      oneDayAgo: normalize(feeV2.oneDayAgo, USD_DECIMALS),
      sevenDaysAVG: normalize(feeV2.sevenDaysAVG, USD_DECIMALS),
    },
    totalFee: {
      oneDayAgo: normalize(feeV1.oneDayAgo.plus(feeV2.oneDayAgo), USD_DECIMALS),
      sevenDaysAVG: normalize(
        feeV1.sevenDaysAVG.plus(feeV2.sevenDaysAVG),
        USD_DECIMALS
      ),
    },
  };
  res.json(JSON.stringify(response));
};
