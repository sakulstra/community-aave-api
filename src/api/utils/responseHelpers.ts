import { NextApiResponse } from "next";

/**
 * Applies common cache headers on the response object
 * @param res
 * @param cacheSeconds the number of seconds till async revalidation will be triggered
 */
export function applyCacheHeaders(
  res: NextApiResponse,
  cacheSeconds: number = 10,
  swr: boolean = true
) {
  res.setHeader(
    "Cache-Control",
    `s-maxage=${cacheSeconds}${swr ? `, stale-while-revalidate` : ""}`
  );
  res.setHeader("Content-Type", "application/json");
}

export function handleBadRequest(res: NextApiResponse, error) {
  res.statusCode = 400;
  res.json(JSON.stringify({ error }));
}
