const express = require("express");
const router = express.Router();

const PostitController = require("../controllers/postits");

router.get("/", PostitController.postit_getAll);

router.get("/:postitId", PostitController.postit_getOne);

router.post("/", PostitController.postit_createdOne);

router.patch("/:postitId", PostitController.postit_updateOne);

module.exports = router;
