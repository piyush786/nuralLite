// <<<<<<< HEAD
// const mongoClient = require("mongodb").MongoClient;
// const url =
//   "mongodb+srv://NuralLiteDB-83ac9dfd.mongo.ondigitalocean.com/?retryWrites=true&replicaSet=NuralLiteDB&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=NuralLiteDB&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true&3t.sslTlsVersion=TLS";
// =======
const mongoClient = require("mongodb").MongoClient
const url = "mongodb+srv://nuralLite:1380695dlFaAn7ut@NuralLiteDB-83ac9dfd.mongo.ondigitalocean.com/admin";
// >>>>>>> origin/main
module.exports = {
  url,
  mongoClient,
};

