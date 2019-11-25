const express = require("express");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator");
const { requireSignin } = require("../controllers/auth");
const { getPosts, createPost } = require("../controllers/post");

const router = express.Router();

router.get("/", requireSignin, getPosts);
router.post("/post", createPostValidator, createPost);

// any route containing :userId, our app will first execute userById()
router.param("userId", userById);

module.exports = router;