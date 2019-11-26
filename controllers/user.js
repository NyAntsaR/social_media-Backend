const _ = require("lodash")
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

// Update user
exports.updateUser = (req, res, next) => {
    let user = req.profile;
    // extend - mutate the source object based on the new information from the req.body
    user = _.extend(user, req.body);
    user.updated = Date.now();
    // save the user in the database
    user.save(err => {
        if (err) {
            return res.status(401).json({
                error: "You are not authorized to perform this action!"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({
            user
        });
    });
}

// Delete user
exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: `${user.name} account has been deleted!`
        });
    })
}