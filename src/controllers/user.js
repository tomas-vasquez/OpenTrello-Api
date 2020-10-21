const User = require("../models/user");

const { buildToken, destroyToken } = require("../helpers/tokens");
const { validationResult } = require("express-validator");
const {
  validationLogout,
  validationSignup,
  sanitize,
} = require("../midlewares/validation");
const { mongoErrorHandler } = require("../helpers/errors");
const bcrypt = require("bcrypt-nodejs");
const cache = require("../helpers/cache");
const { profileCacheTimeout } = require("../config");
const auth = require("../midlewares/auth");

module.exports = function (app) {
  /*  =========================================================
   * login
   * ========================================================= */

  app.post("/login", function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let email = req.body.email;
    let password = req.body.password;
    // let remember_token = req.body.remember_token;

    User.getProfile(email, "email", (error, profile) => {
      if (error) return mongoErrorHandler(error, req, res);
      if (!profile) return res.status(422).send({ msg: "error-unexist-email" });

      if (!bcrypt.compareSync(password, profile.local.password)) {
        return res.status(422).send({ msg: "error-incorrect-password" });
      }

      //we build the new token
      let token = buildToken(email, false);

      //links to cache
      cache.put(email, { ...profile }, profileCacheTimeout);
      cache.put(profile.user_name, email, profileCacheTimeout);

      User.getProfile(email, "email", (error, profile) => {
        if (error) return mongoErrorHandler(error, req, res);
        return res
          .status(200)
          .send({ api_token: token, user_data: sanitize({ ...profile }) });
      });
    });
  });

  /*  =========================================================
   * signup
   * ========================================================= */

  app.post("/signup", validationSignup, function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let email = req.body.email;
    let password = req.body.password;
    let user_name = req.body.user_name;

    User.getProfile(email, "email", (error, profile) => {
      if (error) return mongoErrorHandler(error, req, res);
      if (profile)
        return res.status(422).send({ msg: "error-already-exist-email" });

      User.getProfile(user_name, "user_name", (error, profile) => {
        if (error) return mongoErrorHandler(error, req, res);
        if (profile)
          return res.status(422).send({ msg: "error-already-exist-username" });

        // create a new User
        const newUser = new User.model();
        newUser.user_name = user_name;
        newUser.local = {
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
        };

        newUser.save({}, (error, user) => {
          if (error) return mongoErrorHandler(error, req, res);

          let user_name = user._doc.user_name;
          let email = user._doc.local.email;

          //we build the new token
          let token = buildToken(email);

          //links to cache
          cache.put(email, { ...user._doc }, profileCacheTimeout);
          cache.put(user_name, email, profileCacheTimeout);

          res
            .status(200)
            .send({ api_token: token, ...sanitize({ ...user._doc }) });
        });
      });
    });
  });

  /*  =========================================================
   * logut
   * ========================================================= */

  app.get("/logout", validationLogout, auth, function (req, res) {
    const token = req.headers["api-token"];
    destroyToken(token);
    res.status(200).send();
  });
};
