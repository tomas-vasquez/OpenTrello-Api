const helpers = {};
var cache = require("../helpers/cache");

function generateRandomString() {
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let buildToken = 0;
  for (let i = 0; i < 31; i++) {
    buildToken += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return "$" + buildToken;
}

helpers.buildToken = (email, remember_token) => {
  let newToken = generateRandomString();

  if (remember_token) {
    cache.put(newToken, email);
  } else {
    cache.put(newToken, email, 1000 * 60 * 60 * 60 * 2);
  }

  // cache.exportCache();
  return newToken;
};

helpers.destroyToken = (token) => {
  cache.delete(token);
};

module.exports = helpers;
