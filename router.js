const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ 'dest': 'uploads/' })
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const layerController = require('./controllers/layerController')

//user related routes
router.get('/', userController.home)
router.get('/create-register', userController.viewRegisterScreen)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//profile related routes
router.get('/profile', userController.viewProfile)

//post related routes
router.get('/create-building', userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-building', userController.mustBeLoggedIn, postController.create)
router.post('/search', postController.search)
router.get('/locations', postController.viewLocations)
router.get('/post/:id', postController.viewBuilding)
router.get('/post/:id/edit', postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete)
router.get('/list-buildings/:username', userController.ifUserExists, userController.profilePostScreen)


//layer related routes
router.get('/post/:id/layer/create-layer',   layerController.viewCreateLayer)
router.post('/post/:id/layer/create-layer', userController.mustBeLoggedIn, upload.array('images', 10), layerController.createLayer)
//router.get('/post/:id/layer/:id/layer-edit', layerController.viewEditLayer)
//router.post('/post/:id/layer/:/layer-edit', userController.mustBeLoggedIn, layerController.editLayer)



module.exports = router