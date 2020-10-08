const fs = require("fs-extra");
const { urlStoragePrivate } = require("../config");

module.exports = {
  //mongodb
  mongoErrorHandler: (error, req, res) => {
    return res.status(500).send(error);
  },
  //cache
  cacheErrorHandler: (error) => {
    switch (error.code) {
      case "ENOENT":
        fs.createFile(urlStoragePrivate + "/cache.json").then(() => {
          fs.writeFile(urlStoragePrivate + "/cache.json", '"{}"');
        });
        break;

      default:
        break;
    }
    console.log(error.code);
  },
};
