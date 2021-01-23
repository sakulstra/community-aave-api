/**
 * This api endpoint returns the current liquidity for a specified protocol version + historical rates.
 * The api answer is cached on vercel edge CDN and refreshed
 */

export default async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.json(JSON.stringify({ ok: 200 }));
};
