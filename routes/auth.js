const express = require("express");
const { signup } = require("../controllers/auth");
const { createPostValidator } = require("../validator");

const router = express.Router();

router.post("/signup", signup);

module.exports = router;