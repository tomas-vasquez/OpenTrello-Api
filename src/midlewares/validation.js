const { body, query } = require("express-validator");

const validationLogin = [
  body("email").not().isEmpty().isEmail().normalizeEmail(),
  body("password").not().isEmpty().trim().escape(),
  // body("remember_token").not().isEmpty(),
];
const validationLogout = [];

const validationSignup = [
  body("email").not().isEmpty().isEmail().normalizeEmail(),
  body("user_name").not().isEmpty(),
  body("password").not().isEmpty(),
];

const sanitize = function (profile) {
  let sanitise = profile;
  sanitise.email = sanitise.local.email;
  sanitise.local = undefined;
  sanitise.__v = undefined;
  return sanitise;
};

module.exports = {
  sanitize,
  validationLogin,
  validationSignup,
  validationLogout,
};
