import { fetchV1, fetchV2 } from "@api/endpoints/liquidity";
import { Version } from "@api/enums";
import {
  applyCacheHeaders,
  handleBadRequest,
} from "@api/utils/responseHelpers";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * TODO: properly handle timestamp and poolId parameters
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { version, poolId, timestamp } = req.query;
  if (!timestamp) {
    // caching response fro 30s
    applyCacheHeaders(res, 30);
  } else {
    // cache past dates for 90 days
    const now = Math.floor(new Date().getTime() / 1000);
    if (Number.parseInt(timestamp as string) > now) {
      return handleBadRequest(res, `timestamp should be in the past`);
    } else {
      applyCacheHeaders(res, 60 * 60 * 24 * 90);
    }
  }

  if (!version)
    return handleBadRequest(
      res,
      `version is required: [${Object.values(Version)}]`
    );
  if (version === Version.V1) {
    res.json(JSON.stringify(await fetchV1()));
  }
  if (version === Version.V2) {
    res.json(JSON.stringify(await fetchV2()));
  }
};
