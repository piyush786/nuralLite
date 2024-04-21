const mongoClient = require("mongodb").MongoClient
const url = "mongodb://nuraltech:nuraltech%40123@165.232.190.44:27017/authSource=nuraltechLite&authMechanism=SCRAM-SHA-1";
module.exports = {
  url,
  mongoClient
}
