const express = require('express')
const route = express.Router()
const authController = require('../controller/authController')

route.get("/", authController.getUsers)
route.post("/signup", authController.signup)
route.post("/verifyEmail", authController.verifyEmail)
route.post("/login", authController.login)
 


module.exports = route