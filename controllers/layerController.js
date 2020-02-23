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


exports.createLayer = async function(req, res) {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.address,
      limit: 1,
      autocomplete: true
    })
    .send()
  req.body.coordinates = response.body.features[0].geometry.coordinates

  req.body.images = []
  for(const file of req.files) {
    let image = await cloudinary.v2.uploader.upload(file.path)
    req.body.images.push({
      url: image.secure_url,
      public_id: image.public_id
    })
  }

  let layer = new Layer(req.body, req.session.user._id, req.params.id, req.visitorId)
  console.log("layer:",layer)
  layer.create().then((newId) => {
      req.flash("success", "New Floor successfully created")
      req.session.save(() => res.redirect(`/post/${req.params.id}/layer/${newId}`))
  }).catch(function (errors) {
    errors.forEach(error => req.flash("errors", error))
    req.session.save(() => res.redirect(`/post/${req.params.id}/layer/create-layer`))
  })
  
}


exports.viewSingle = async function (req, res) {
  try {
    let layer = await Layer.findSingleById(req.params.id, req.visitorId)
    res.render('single-layer', {layer: layer})
  } catch {
    res.render("404")
  }
  
 
}