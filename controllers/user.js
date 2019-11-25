const User = require ("../models/user");

// Find the user by Id
exports.userById = ( req, res, next, id ) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        // add profile object in req with user info
        req.profile = user
        next();
    })
}