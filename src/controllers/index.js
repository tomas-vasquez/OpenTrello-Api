module.exports = function (app) {
  require("./user")(app);
  require("./tasks")(app);
  require("./cards")(app);
};
