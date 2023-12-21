const express = require('express')
const route = express.Router()
const authController = require('../controller/authController')

route.get("/", authController.getUsers)
route.post("/signup", authController.signup)
route.post("/login", authController.login)
route.put("/:id/markAsTeamMember", authController.markAsTeamMember)

module.exports = route