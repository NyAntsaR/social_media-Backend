const express = require('express');
const postController = require ('../controllers/post');

// to have access to the express router
const router = express.Router();

router.get('/', postController.getPosts);
router.post('/post', postController.createPost);

module.exports = router;
