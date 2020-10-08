const { body, query } = require("express-validator");

const validationLogin = [
  body("email").not().isEmpty().isEmail().normalizeEmail(),
  body("password").not().isEmpty().trim().escape(),
  body("remember_token").not().isEmpty(),
];
const validationLogout = [];

const validationSignup = [
  body("email").not().isEmpty().isEmail().normalizeEmail(),
  body("user_name").not().isEmpty(),
  body("password").not().isEmpty(),
];

module.exports = {
  validationLogin,
  validationSignup,
  validationLogout,
};
