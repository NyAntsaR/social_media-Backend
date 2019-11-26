const express = require("express");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator");
const { requireSignin } = require("../controllers/auth");
const { getPosts, createPost, postedByUser } = require("../controllers/post");

const router = express.Router();

router.get("/", getPosts);
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/post/by/:userId", requireSignin, postedByUser)

// any route containing :userId, our app will first execute userById()
router.param("userId", userById);

module.exports = router;