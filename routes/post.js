const express = require("express");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator");
const { requireSignin } = require("../controllers/auth");
const { getPosts, createPost, postedByUser, postById, isPoster, updatePost, deletePost } = require("../controllers/post");

const router = express.Router();

router.get("/", getPosts);
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/post/by/:userId", requireSignin, postedByUser);
router.put("/post/:postId", updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

// any route containing :userId, our app will first execute userById()
router.param("userId", userById);
router.param("postId", postById);

module.exports = router;