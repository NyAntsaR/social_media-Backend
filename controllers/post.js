const Post = require('../model/post');


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
    post.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error:err
            })
        }
        res.status(200).json({
            post: result
        });
    });
};

