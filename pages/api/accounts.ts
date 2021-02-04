import { Version } from "@api/enums";
import {
  applyCacheHeaders,
  handleBadRequest,
} from "@api/utils/responseHelpers";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * returns a certain user
 * borrow positions are per user & per
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, poolId, timestamp } = req.query;
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
};
