const { MongoMemoryReplSet } = require("mongodb-memory-server");
const fs = require("fs");

const config = {
  mongoPort: 27017,
  dbPath: process.env.DB_PATH || undefined,
  dbName: "aave",
};

if (config.dbPath && !fs.existsSync(config.dbPath)) {
  fs.mkdirSync(config.dbPath);
}

const startMongo = async () => {
  const replSet = new MongoMemoryReplSet({
    debug: process.env.DEBUG || false,
    replSet: {
      storageEngine: 'wiredTiger',
    },
    instanceOpts: [
      {
        port: config.mongoPort,
        dbPath: config.dbPath,
        dbName: config.dbName,
      },
    ],
  });
  return replSet
      .waitUntilRunning()
      .then(async () => console.info(`started mongodb: ${await replSet.getConnectionString()}`));
};

startMongo();
