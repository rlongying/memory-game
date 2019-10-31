let DB = require("./dbConfig").DB;

const MongoClient = require("mongodb").MongoClient;

const db = async () => {
  let client;

  try {
    client = await MongoClient.connect(DB.uri, { useUnifiedTopology: true });
  } catch (e) {
    console.log(e);
  }

  let collection = client.db(DB.dbName).collection(DB.memoryGame);
  //   collection
  //     .find()
  //     .forEach(doc => console.log("inside db, doc: " + JSON.stringify(doc)));

  return collection;
};

module.exports = db();
