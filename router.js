const express = require('express')
const router = express.Router({mergeParams: true})
const multer = require('multer')
const upload = multer({ 'dest': 'uploads/' })
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const layerController = require('./controllers/layerController')

//user related routes
router.get('/',   userController.home )
router.get('/create-register', userController.viewRegisterScreen)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//profile related routes
router.get('/profile', userController.viewProfile)
router.get('/layer-list/:username', userController.ifUserExists, userController.profileLayerScreen)

//post related routes
router.get('/create-building', userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-building', userController.mustBeLoggedIn, postController.create)
router.post('/search', postController.search)
router.get('/locations', userController.mustBeLoggedIn, postController.viewLocations)
router.get('/post/:id', postController.viewBuilding)
router.get('/post/:id/edit', postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete)
router.get('/list-buildings/:username', userController.mustBeLoggedIn, userController.ifUserExists, userController.profilePostScreen)


//layer related routes
router.get('/post/:id/layer/create-layer',   layerController.viewCreateLayer)
router.get('/post/:id/layer/:id',  layerController.viewSingle)
router.get('/post/:id/layer/:id',  layerController.viewBuildingLayers)
router.post('/post/:id/layer/create-layer', upload.array('images', 4), userController.mustBeLoggedIn, layerController.createLayer)
router.get('/layer/:id/edit', layerController.viewEditLayer)
router.post('/layer/:id/edit', userController.mustBeLoggedIn, layerController.edit)



module.exports = router