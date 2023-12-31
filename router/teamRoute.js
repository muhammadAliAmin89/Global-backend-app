const express = require("express")
const route = express.Router();
const { TeamController } = require("../controller/teamController")

route.post('/create', TeamController.createTeam);
route.get('/:teamId/members', TeamController.getTeamMembers);
route.get('/', TeamController.getAllTeamsWithMembers);
route.post('/sendMessage', TeamController.sendMessage);

module.exports = route