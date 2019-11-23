const Post = require('../models/post');

exports.getPosts = (req, res) => {
    res.json({
        posts: [
            {title: 'First post'},
            { title: 'Second post'}
        ]
    });
};

// Creating a new post
exports.createPost = (req, res) => {
    const post = new Post( req.body );
    post.save().then(result => {
        res.status(200).json({
            post: result
        });
    });
};

