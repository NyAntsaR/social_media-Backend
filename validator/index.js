// Post
exports.createPostValidator = (req, res, next) => {
    // title
    req.check("title", "Write a title").notEmpty();
    req.check("title", "Title must be between 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });
    // body
    req.check("body", "Write a body").notEmpty();
    req.check("body", "Body must be between 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
};

// User
exports.userSignupValidator = (req, res, next) => {
    // name is not null and between 4-10 characters
    req.check("name", "Please enter your name").notEmpty();

    // email is not null, valid and normalized
    req.check("email", "Email is required!")
        .matches(/.+\@.+\..+/)
        .withMessage("Please enter a valid email!")
        .isLength({
            min: 4,
            max: 32
    })

    //check password
    req.check("password", "Please enter your password").notEmpty();
    req.check("password")
        .isLength({ min:6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least 1 number")

    // check for errors
    const errors = req.validationErrors();

    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();

}