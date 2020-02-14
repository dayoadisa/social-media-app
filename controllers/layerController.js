const Post = require('../models/Post')
const Layer = require('../models/Layer')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const mapBoxToken = process.env.MAPBOX_TOKEN;
const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: 'dcu4avexf',
  api_key: '975771826326426',
  api_secret: process.env.CLOUDINARY_SECRET
})

exports.viewCreateLayer = async function (req, res) {
 
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId)
    res.render('create-layer', { post: post })
  } catch {
    res.render('404')
  }
}


exports.createLayer = function(req, res) {
  let layer = new Layer(req.body, req.params.id, req.visitorId)
  layer.create().then((newId) => {
      req.flash("success", "New Floor successfully created")
      req.session.save(() => res.redirect(`/post/${req.params.id}/layer/${newId}`))
  }).catch((errors) => {
    errors.forEach(error => req.flash("errors", error))
    req.session.save(() => res.redirect(`/post/${req.params.id}/layer/create-layer`))
  })
}