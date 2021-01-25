import { getMongoClient } from "@api/utils/mongoClient";

export async function updateCache() {
  return { test: 1 };
}

export async function serveCache() {
  const { db } = await getMongoClient();
  const cache = await db.collection("cache").findOne({ _id: "liquidity" });
  if (cache) return cache;
  return await updateCache();
}
