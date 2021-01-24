/**
 * In essence this just created a mongo client
 * The sugar around here is just relevant for serverless environments & hot reload to ensure the connection is recycled if possible.
 */
import { Db, MongoClient } from "mongodb";

const MONGODB_DB = "aave";
const MONGODB_URI = process.env.MONGO_URI;

type Cached = { conn: { client: MongoClient; db: Db }; promise: Promise<any> };

let cached: Cached = (global as any).mongo as Cached;
if (!cached) cached = (global as any).mongo = {} as Cached;

export async function getMongoClient() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const conn = {} as {
      client: MongoClient;
      db: Db;
    };
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = MongoClient.connect(MONGODB_URI, opts)
      .then((client) => {
        conn.client = client;
        return client.db(MONGODB_DB);
      })
      .then((db) => {
        conn.db = db;
        cached.conn = conn;
      });
  }
  await cached.promise;
  return cached.conn;
}
