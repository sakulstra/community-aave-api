import { getMongoClient } from "./mongoClient";

type GetLatestTimestampProps = {
  collection: string;
  query?: { [key: string]: any };
  timeStampKey?: string;
};

/**
 * returns the timestamp of the newest entry in the database
 * @param param0
 */
export const getLatestTimestamp = async ({
  collection,
  query = {},
  timeStampKey = "lastUpdateTimestamp",
}: GetLatestTimestampProps): Promise<number> => {
  const { db } = await getMongoClient();
  const latest = await db
    .collection(collection)
    .findOne(query, { sort: { [timeStampKey]: -1 } });
  return latest?.[timeStampKey] ?? 0;
};

type BatchInsertOrUpdateProps = {
  /**
   * items to be inserted in order
   */
  items: any[];
  /**
   * collection identifier
   */
  collection: string;
  /**
   * additional props that are mutated on each item
   */
  addition?: { [key: string]: any };
};

export const batchInsertOrUpdate = async ({
  items,
  collection,
  addition,
}: BatchInsertOrUpdateProps) => {
  const { db } = await getMongoClient();
  if (items.length) {
    // TODO: must be enhanced with pool id
    const bulk = db.collection(collection).initializeOrderedBulkOp();
    items.map((item) => {
      // update existing entries
      bulk
        .find({
          _id: item.id,
        })
        .updateOne({
          $set: { ...item, ...addition },
        });
      // upsert new ones
      bulk
        .find({
          _id: item.id,
        })
        .upsert()
        .updateOne({
          $setOnInsert: { ...item, ...addition },
        });
    });
    return bulk.execute();
  }
};
