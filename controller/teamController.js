// teamController.js
const userModel = require('../models/authModel');
const Team = require('../models/teamModel');
const sendResponse = require("../helper/helper");

const TeamController = {
    createTeam: async (req, res) => {
        try {
            const { name, members } = req.body;

            const newTeam = await Team.create({
                name,
                members: members || [],
            });

            if (members && members.length > 0) {
                const users = await userModel.find({ _id: { $in: members } });
                await Promise.all(users.map(async (user) => {
                    // Update each member's team array
                    await userModel.findByIdAndUpdate(user._id, { $push: { teams: newTeam._id } });
                }));
            }

            res.status(201).json({
                success: true,
                message: 'Team created successfully',
                team: newTeam,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Team creation failed',
                error: error.message,
            });
        }
    },
    getTeamMembers: async (req, res) => {
        try {
            const { teamId } = req.params;
            const team = await Team.findById(teamId).populate("members  messages.sender")

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found',
                });
            }
            const members = team.members.map(member => ({
                _id: member._id,
                firstName: member.firstName,
                lastName: member.lastName,
                // Add other member properties as needed
            }));

            const messages = team.messages.map(message => ({
                content: message.content,
                createdAt: message.createdAt,
                sender: {
                    _id: message.sender._id,
                    firstName: message.sender.firstName,
                    lastName: message.sender.lastName
                    // Add other sender properties as needed
                },
            }));
            const memberDetails = await userModel.find({ _id: { $in: team.members } });

            res.status(200).json({
                success: true,
                team: {
                    name: team.name,
                    members,
                    tasks: team.tasks, // Include other team properties as needed
                    messages,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching team members',
                error: error.message,
            });
        }
    },
    getAllTeamsWithMembers: async (req, res) => {
        try {
            // Get all teams with members details
            const teams = await Team.find().populate({
                path: 'members',
                select: 'firstName lastName email dateOfBirth gender contact userStatus createdAt updatedAt' // Include the fields you need
            }).populate({
                path: 'projects',
                select: 'title description dueDate projectStatus updatedAt createdAt _id',
            }).populate({
                path: 'messages.sender',
                select: 'firstName lastName email dateOfBirth gender contact userStatus createdAt updatedAt',
            })

            res.status(200).json({
                success: true,
                message: 'All teams with members fetched successfully',
                teams,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching teams with members',
                error: error.message,
            });
        }
    },
    sendMessage: async (req, res) => {
        try {
            const { team, senderId, content } = req.body;
            const obj = { team, senderId, content };

            // Validate input
            if (!obj.team || !obj.senderId || !obj.content) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error: Please provide team, senderId, and content.',
                });
            }

            const findTeam = await Team.findById(obj.team);
            if (!findTeam) {
                return res.status(404).json(sendResponse(
                    false, "Team not found", null
                ));
            }

            const message = {
                sender: senderId,
                content: content,
                createdAt: new Date(),
            };

            // Use $addToSet to avoid duplicate messages
            await Team.updateOne({ _id: obj.team }, { $addToSet: { messages: message } });

            res.status(200).json({
                success: true,
                message: "Message sent successfully",
                team: findTeam,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error sending message',
                error: error.message,
            });
        }
    },



}

module.exports = { TeamController };