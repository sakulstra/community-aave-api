import { NextApiResponse } from "next";

/**
 * Applies common cache headers on the response object
 * @param res
 * @param cacheSeconds the number of seconds till async revalidation will be triggered
 */
export function applyCacheHeaders(
  res: NextApiResponse,
  cacheSeconds: number = 10
) {
  res.setHeader(
    "Cache-Control",
    `s-maxage=${cacheSeconds}, stale-while-revalidate`
  );
  res.setHeader("Content-Type", "application/json");
}
