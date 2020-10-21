const { validationResult } = require("express-validator");
const { mongoErrorHandler } = require("../helpers/errors");
const auth = require("../midlewares/auth");
const cards = require("../models/cards");

module.exports = function (app) {
  app.get("/cards", auth, function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let userId = req.user._id;

    cards.getCards(userId, (error, cards) => {
      if (error) return mongoErrorHandler(error, req, res);
      return res.send(cards);
    });
  });

  app.post("/cards", auth, function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = req.user;
    cards.addCard(
      { cardTitle: "Card title", userId: user._id },
      (error, newDocument) => {
        if (error) return mongoErrorHandler(error, req, res);
        return res.send(newDocument);
      }
    );
  });

  app.put("/cards", function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const cardTitle = req.body.cardTitle;
    const cardId = req.body.cardId;

    cards.updateCard(cardId, { cardTitle }, (error, newDocument) => {
      if (error) return mongoErrorHandler(error, req, res);
      return res.send(newDocument);
    });
  });
};
