import { normalize, valueToZDBigNumber } from "@aave/protocol-js";
import { gqlSdkV2 } from "@api/subgraph";
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  applyCacheHeaders(res, 60);
  const oneDayInSeconds = 24 * 60 * 60;
  const currentTimestamp = Math.round(new Date().getTime() / 1000);
  const oneDayAgoTimestamp = currentTimestamp - oneDayInSeconds;
  const sevenDaysAgoTimestamp = currentTimestamp - 7 * oneDayInSeconds;
  const response = await gqlSdkV2.ReservesFeesQuery({
    oneDayAgo: oneDayAgoTimestamp,
    sevenDaysAgo: sevenDaysAgoTimestamp,
  });
  const fee = response.data?.reserves.reduce(
    (acc, reserve) => {
      const usdPriceEth = response.data.priceOracle.usdPriceEth;

      const getFees = ({
        lifetimeDepositorsInterestEarned,
        lifetimeFlashLoanPremium,
        lifetimeReserveFactorAccrued,
      }: {
        lifetimeDepositorsInterestEarned: string;
        lifetimeFlashLoanPremium: string;
        lifetimeReserveFactorAccrued: string;
      }) => {
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
  res.json(
    JSON.stringify({
      oneDayAgo: normalize(fee.oneDayAgo, USD_DECIMALS),
      sevenDaysAVG: normalize(fee.sevenDaysAVG, USD_DECIMALS),
    })
  );
};
