const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("./midlewares/cors");

//config
const { urlDB, port } = require("./config");

//mongodb
mongoose.connect(urlDB, { useMongoClient: true }, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("> connected to " + urlDB);
  }
});

//express
var app = express();

// middlewares
app.use(cors);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//controllers
require("./controllers/user")(app);
// require("./controllers/userData")(app);
// require("./controllers/academy")(app);
// require("./controllers/admin")(app);

app.listen(app.listen(port));

console.log("> connected on port " + port);
