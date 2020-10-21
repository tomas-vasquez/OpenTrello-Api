const { validationResult } = require("express-validator");
const { mongoErrorHandler } = require("../helpers/errors");
const auth = require("../midlewares/auth");
const tasks = require("../models/tasks");

module.exports = function (app) {
  app.get("/tasks", auth, function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let userId = req.user._id;

    tasks.getTasks(userId, (error, tasks) => {
      if (error) return mongoErrorHandler(error, req, res);
      return res.send(tasks);
    });
  });

  app.post("/tasks", auth, function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = req.user;
    const newTask = {
      ...req.body,
      user_id: user._id,
    };

    tasks.addTask(newTask, (error, _newTask) => {
      if (error) return mongoErrorHandler(error, req, res);
      return res.send(_newTask);
    });
  });

  app.put("/tasks", function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const taskTitle = req.body.taskTitle;
    const completed = req.body.completed;
    const taskId = req.body._id;

    tasks.updateTask(taskId, { taskTitle, completed }, (error, newTask) => {
      if (error) return mongoErrorHandler(error, req, res);
      return res.send(newTask);
    });
  });

  app.delete("/tasks", function (req, res) {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const taskId = req.body.taskId;

    tasks.deleteTask(taskId, (error) => {
      if (error) return mongoErrorHandler(error, req, res);
      return res.send();
    });
  });
};
