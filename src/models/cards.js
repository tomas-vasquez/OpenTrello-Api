const mongoose = require("mongoose");
const { Schema } = mongoose;
const { documentsToArray } = require("../helpers/utils");
const tasks = require("./tasks");

const userSchema = new mongoose.Schema({
  cardTitle: String,
  user_id: { type: Schema.ObjectId },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const model = mongoose.model("Card", userSchema);

const addCard = function (data, callback) {
  const newCard = new model();
  newCard.cardTitle = data.cardTitle;
  newCard.user_id = data.userId;

  newCard.save({}, (a, newCard) => {
    console.log(newCard._doc);
    callback(null, { ...newCard._doc });
  });
};

const getCards = function (id, callback) {
  model.find({ user_id: id }, function (error, cards) {
    console.log(documentsToArray(cards));
    callback(error, documentsToArray(cards));
  });
};

const updateCard = function (cardId, newData, callback) {
  model.updateOne({ _id: cardId }, newData, function (error, result) {
    console.log(cardId);
    callback(error);
  });
};

const deleteCard = function (cardId, callback) {
  model.deleteOne({ _id: cardId }, (error) => {
    tasks.model.deleteMany({ parentid: cardId }, (error) => {
      callback(error);
    });
  });
};

module.exports = {
  addCard,
  getCards,
  updateCard,
  deleteCard,
};
