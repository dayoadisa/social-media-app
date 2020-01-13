const Post = require('../models/Post')

exports.viewCreateScreen = function(req, res) {
    res.render('map')
}

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create().then(function() {
        res.send("New Post Created")
    }).catch(function(errors) {
        res.send(errors)
    })
}

exports.viewMap = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id)
        res.render('map', {post: post})
      } catch {
        res.send("404 template will go here.")
      }
}