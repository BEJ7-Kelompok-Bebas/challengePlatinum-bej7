const express = require('express')
const router = express.Router()
const { UserController } = require('../controller/user.controller')

const userController = new UserController()

//register routes
router.post('/register',userController.register)

//login routes
router.post('/login', userController.login)

module.exports = router