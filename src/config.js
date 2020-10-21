const path = require("path");

module.exports = {
  port: process.env.PORT || 3001,
  urlDB: process.env.MONGODB_URL || "mongodb://localhost/opentrello",
  urlStoragePrivate: "storage/private/",
};
