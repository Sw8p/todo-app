const express = require("express");
const router = express.Router();

const TodoController = require("../controllers/todos");

router.get("/", TodoController.todo_getAll);

router.get("/:todoId", TodoController.todo_getOne);

router.post("/", TodoController.todo_createdOne);

router.delete("/:todoId", TodoController.todo_deleteOne);

module.exports = router;
