const mongoose = require("mongoose");
const { Schema } = mongoose;
const { documentsToArray } = require("../helpers/utils");

const userSchema = new mongoose.Schema({
  taskTitle: String,
  parentid: { type: Schema.ObjectId },
  user_id: { type: Schema.ObjectId },
  completed: Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const model = mongoose.model("Task", userSchema);

const addTask = function (data, callback) {
  const newTask = new model();
  newTask.taskTitle = data.taskTitle;
  newTask.parentid = data.parentid;
  newTask.user_id = data.user_id;

  newTask.save({}, (a, newTask) => {
    callback(null, { ...newTask._doc });
  });
};

const getTasks = function (id, callback) {
  model.find({ user_id: id }, function (error, tasks) {
    callback(error, documentsToArray(tasks));
  });
};

const updateTask = function (taskId, newData, callback) {
  model.updateOne({ _id: taskId }, newData, function (error) {
    callback(error);
  });
};

const deleteTask = function (taskId, callback) {
  model.deleteOne({ _id: taskId }, (error) => {
    callback(error);
  });
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  model,
};
