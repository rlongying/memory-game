let db = require("../util/db");

const addNewRecord = ({ name, score }) => {
  // try to update record with the name provided,
  // if not exist, add a new recored
  db.then(collection => {
    collection
      .updateOne(
        { name },
        { $set: { name: name, score: parseInt(score) } },
        { upsert: true }
      )
      .catch(err => console.log("update error: " + err));
  });
};

const getTopFive = async () => {
  return await db.then(async collection => {
    return await collection
      .find()
      .sort({ score: -1 })
      .limit(5)
      .toArray();
  });
};

const getRankByName = async name => {
  return await db.then(async collection => {
    return await collection
      .find()
      .sort({ score: -1 })
      .toArray();
  });
};

module.exports = {
  addNew: addNewRecord,
  getTopFive: getTopFive,
  getRank: getRankByName
};
