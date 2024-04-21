const mongoClient = require("mongodb").MongoClient
const url = "mongodb://nuraltech@165.232.190.44:27017/?retryWrites=true&connectTimeoutMS=10000&authSource=nuraltechLite&authMechanism=SCRAM-SHA-1";
module.exports = {
  url,
  mongoClient
}
