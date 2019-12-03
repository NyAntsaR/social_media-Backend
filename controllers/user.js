const _ = require("lodash")
const User = require ("../models/user");
const fs = require("fs");
const formidable = require("formidable");


// Find the user by Id
exports.userById = ( req, res, next, id ) => {
    User.findById(id)
    // populate followers and following users array
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
        
        if (err || !user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        // add profile object in req with user info
        req.profile = user;
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
        res.json(users);
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
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save user
        let user = req.profile;
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });
};

// photo 
exports.userPhoto = (req, res, next ) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data);
    }
    next();
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

// follow/ unfollow
exports.addFollowing = (req, res, next) => {
    // update the following list of the logged in user
    // followId from the client side
    User.findByIdAndUpdate(req.body.userById, {$push: {
        following: req.body.followId
    }}, (err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        } next();
    })
}

exports.addFollowers = (req, res, next) => {
    // update the following list of the logged in user
    // followId from the client side
    // {new: true} return the new data not the old 
    User.findByIdAndUpdate(req.body.followId, {$push: {
        followers: req.body.userId
    }},  { new: true })
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec(( err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    })
}