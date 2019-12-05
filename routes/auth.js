const express = require("express");
const { signup, signin, signout, socialLogin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validator");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

router.post("/social-login", socialLogin)

module.exports = router;