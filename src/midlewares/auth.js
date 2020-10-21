const User = require("../models/user");
const cache = require("../helpers/cache");
const { mongoErrorHandler } = require("../helpers/errors");

module.exports = (req, res, next) => {
  let token = req.headers["api-token"];
  let email = cache.get(token);

  if (!email) {
    return res.status(401).send("Unauthorized. please login first1");
  } else {
    let user = cache.get(email);

    if (!user) {
      User.getProfile(email, "email", (error, profile) => {
        if (error) return mongoErrorHandler(error, req, res);
        if (!profile)
          return res.status(401).send("Unauthorized. please login first");

        //links to cache
        cache.put(email, { ...profile });

        req.user = { ...profile };
        next();
      });
    } else {
      req.user = { ...user };
      next();
    }
  }
};
