const { URL, generatedMongoId } = require("../utils");

const Postit = require("../models/postits");
const Todo = require("../models/todos");

const url = URL + "/postits/";

exports.postit_getAll = (req, res) => {
  Postit.find()
    .select("_id title todos")
    .exec()
    .then(postits => {
      res.status(200).json({
        count: postits.length,
        postits: postits.map(post => {
          const { _id, title, todos } = post;

          return {
            _id,
            title,
            todos: todos.length,
            getRequest: url + post._id
          };
        })
      });
    })
    .catch(err => res.status(404).json({ error: err }));
};

exports.postit_getOne = (req, res) => {
  const { postitId } = req.params;

  Postit.findById(postitId)
    .select("_id title todos")
    .exec()
    .then(post => {
      const { _id, title, todos } = post;

      res.status(200).json({
        _id,
        title,
        tasks: todos.length,
        todos
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.postit_createdOne = (req, res) => {
  const { title } = req.body;
  const newPostit = new Postit({
    _id: generatedMongoId,
    title
  });

  newPostit
    .save()
    .then(postit => {
      const { _id, title } = postit;

      res.status(201).json({
        message: "Created new postit succesfuly",
        postit: {
          _id,
          title,
          getRequest: url + _id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.postit_updateOne = (req, res) => {
  const { postitId } = req.params;
  const updateOps = {};
  for (const ops in req.body) {
    updateOps[ops] = req.body[ops];
  }

  Postit.findByIdAndUpdate(
    postitId,
    { $set: updateOps },
    { new: true, lean: true }
  )
    .exec()
    .then(post => {
      if (!post) res.status(404).json({ message: "postit not found" });
      res.status(200).json(post);
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.postit_addTodo = (req, res) => {
  res.status(200).json({ message: "Todo add to Postit" });
};

exports.postit_delTodo = (req, res) => {
  res.status(200).json({ message: "Todo deleted from Postit" });
};

exports.postit_deleteOne = (req, res) => {
  const { postitId } = req.params;
};
