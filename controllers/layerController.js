const Layer = require('../models/Layer')
const Post = require('../models/Post')
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

  let layer = new Post(req.body, req.session.user._id, req.params.id, req.visitorId)
  
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
     let layers = await Layer.findSingleById(req.params.id, req.visitorId)
      
      res.render('single-layer', {  layers: layers, post: req.params.id, mapBoxToken: process.env.MAPBOX_TOKEN})
     
     
   } catch {
     res.render('404')
   } 
}

exports.viewBuildingLayers = function (req, res) {

}

exports.viewEditLayer = async function(req, res) {
  
  try {
    let layer = await Layer.findSingleById(req.params.id, req.visitorId)
    res.render('edit-layer', { layer: layer, post: req.params.id})
  } catch {
    res.render('404')
  } 
}

exports.edit = async function (req, res) {


  req.body.images = []
  for(const file of req.files) {
    let image = await cloudinary.v2.uploader.upload(file.path)
    req.body.images.push({
      url: image.secure_url,
      public_id: image.public_id
    })
  }
  
  let layer = new Layer(req.body, req.visitorId, req.params.id)
  layer.update().then((status) => {
    // the post was successfully updated in the database
    // or user did have permission, but there were validation errors
    if (status == "success") {
      // post was updated in db
      req.flash("success", "Post successfully updated.")
      req.session.save(function () {
        res.redirect(`/layer/${req.params.id}/edit`)
      })
    } else {
      layer.errors.forEach(function (error) {
        req.flash("errors", error)
      })
      req.session.save(function () {
        res.redirect(`/layer/${req.params.id}/edit`)
      })
    }
  }).catch(() => {
    // a post with the requested id doesn't exist
    // or if the current visitor is not the owner of the requested post
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(function () {
      res.redirect("/")
    })
  })
}
