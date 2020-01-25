const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

//user related routes
router.get('/', userController.home)
router.get('/create-register', userController.viewRegisterScreen)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//profile related routes
// router.get('/profile/:username', userController.ifUserExists, userController.profilePostScreen)
router.get('/profile', userController.viewProfile)
//post related routes
router.get('/create-building',userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-building', userController.mustBeLoggedIn, postController.create)
router.get('/post/:id', postController.viewBuilding)
router.get('/post/:id/edit', postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn , postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn , postController.delete)
router.get('/list-buildings/:username', userController.ifUserExists, userController.profilePostScreen)

module.exports = router