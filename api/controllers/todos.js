const mongoose = require("mongoose");
const { URL, generatedMongoId } = require("../utils");

const Todo = require("../models/todos");
const Postit = require("../models/postits");

const url = URL + "/todos/";

exports.todo_getAll = async (req, res) => {
  const todos = await Todo.find()
    .sort("postit")
    .select("-__v")
    .lean()
    .exec();
  if (!todos) {
    return res.status(404);
  }
  res.status(200).json({
    count: todos.length,
    todos
  });
};

exports.todo_getOne = (req, res) => {
  const { todoId } = req.params;

  Todo.findById(todoId)
    .select("-__v")
    .lean()
    .populate("postit", "_id title")
    .exec()
    .then(todo => {
      res.status(200).json(todo);
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.todo_createdOne = (req, res) => {
  const { name, urgency, postit } = req.body;

  Postit.findOne({ title: postit })
    .exec()
    .then(post => {
      if (post) {
        return post;
      }
      return new Postit({
        _id: new mongoose.Types.ObjectId(),
        title: postit
      });
    })
    .then(result => {
      console.log(result);

      const newTodo = new Todo({
        _id: new mongoose.Types.ObjectId(),
        name,
        urgency,
        postit: result._id
      });

      result
        .set({ todos: [...result.todos, newTodo._id] })
        .save((err, updatedPostit) => {
          console.log("updated postit : ", updatedPostit);
        });

      return newTodo.save();
    })
    .then(todo => {
      const { _id, name } = todo;
      console.log("new todo : ", todo);

      res.status(200).json({
        message: "Created todo succesfuly",
        name,
        getRequest: url + _id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.todo_deleteOne = (req, res) => {
  const { todoId } = req.params;

  Todo.findByIdAndRemove(todoId)
    .select("name")
    .exec()
    .then(todo => {
      res.status(200).json({
        message: "todo deleted",
        todo
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
