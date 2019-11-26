const Post = require("../models/post");
const formidable = require ("formidable");
const fs = require("fs");

// Get all posts
exports.getPosts = (req, res) => {
    // get the post from the database
    const posts = Post.find()
    .populate("postedBy", "_id name")
    .select('_id title body')
    .then((posts) => {
        res.json({
            posts
        })
    })
    .catch( err => console.log(err));
};

// Create post
exports.createPost = (req, res, next) => {
    // Handle photo upload
    // Give the incoming form field
    let form = new formidable.IncomingForm();
    // keep the image formate
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if ( err ) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if ( files.photo ) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }

        post.save((err, result) => {
            if ( err ) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result);
        })
    })
};

// Get posts by user
exports.postedByUser = (req, res, next) => {
    Post.find({
        postedBy: req.profile._id
    })
    // use populate if it's different module
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
        if ( err ) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            posts
        })
    });
}