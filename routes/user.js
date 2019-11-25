const express = require("express");
const { userById, allUsers, getUser } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);

router.param('userId', userById);

module.exports = router;