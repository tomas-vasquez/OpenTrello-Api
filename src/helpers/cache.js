const cache = require("memory-cache");
const fs = require("fs-extra");
const { urlStoragePrivate } = require("../config");
const { cacheErrorHandler } = require("../helpers/errors");

module.exports = {
  importCache: function () {
    fs.readJson(urlStoragePrivate + "/cache.json", (error, data) => {
      if (error) {
        return cacheErrorHandler(error);
      }
      cache.importJson(data);
    });
  },

  exportCache: function () {
    let data = cache.exportJson();
    fs.writeJson(urlStoragePrivate + "/cache.json", data);
  },

  get: function (key) {
    return cache.get(key);
  },

  put: function (key, value, time) {
    cache.put(key, value, time);
    setTimeout(() => {
      this.exportCache();
    }, 1000);
  },

  delete: function (key) {
    cache.del(key);
  },

  getAll: function () {
    return cache.exportJson();
  },

  deleteAll: function () {
    fs.writeFile(urlStoragePrivate + "/cache.json", '"{}"');
    return cache.clear();
  },
};
