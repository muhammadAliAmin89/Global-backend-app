const express = require('express')
const route = express.Router()
const projectsController = require("../controller/projectsController")

route.get("/", projectsController.get)
route.get("/:id", projectsController.getbyid)
route.post("/", projectsController.add)
route.put("/:id/markAsDone", projectsController.markAsDone)
route.put("/:id", projectsController.edit)
route.delete("/:id", projectsController.del)


module.exports = route