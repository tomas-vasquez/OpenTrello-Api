console.log("=====================================================");

const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("./midlewares/cors");

//config
const { urlDB, port } = require("./config");
const cache = require("./helpers/cache");

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
require("./controllers")(app);

app.get("/cache", ({ res }) => {
  res.send(cache.getAll());
});

app.delete("/cache", ({ res }) => {
  cache.deleteAll();
  res.send("cojjj!!");
});

app.listen(app.listen(port));

console.log("> connected on port " + port);
