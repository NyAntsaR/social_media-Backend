const express = require('express');
const postController = require ('../controllers/post');

// to have access to the express router
const router = express.Router();

router.get('/', postController.getPosts);

module.exports = router;
