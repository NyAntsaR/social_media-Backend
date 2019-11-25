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

// authorization method
exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
}

// show all users
exports.allUsers = (req, res, next) => {
    User.find((err, users) => {
        if ( err ) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            users
        })
    }).select("name email updated created");
}

// show single user
exports.getUser = ( req, res, next ) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}