const sendResponse = require("../helper/helper");
const projectsModel = require("../models/projectsModel")
const Team = require("../models/teamModel")

const projectsController = {
    get: async (req, res) => {
        try {
            let { pageNo, pageSize } = req.query;
            let skipCount = (pageNo - 1) * pageSize;
            let result = await projectsModel.find().limit(pageSize).skip(skipCount);
            res.status(200).send(sendResponse(true, "", result));
        } catch (e) {
            res.status(500).send(sendResponse(false, "Internal Server Error", e));
        }
    },
    getbyid: async (req, res) => {
        try {
            let id = req.params.id;
            let result = await projectsModel.findById(id);
            res.status(200).send(sendResponse(true, "", result));
        } catch (e) {
            res.status(500).send(sendResponse(false, "Internal Server Error", e));
        }
    },
    add: async (req, res) => {
        try {
            let { title, description, dueDate } = req.body;
            let obj = { dueDate, description, title };

            let errArr = [];

            if (!obj.dueDate) {
                errArr.push('Required dueDate');
            }
            if (!obj.description) {
                errArr.push('Required description');
            }
            if (!obj.title) {
                errArr.push('Required title');
            }
            if (errArr.length > 0) {
                res.send({
                    isSuccessfull: false,
                    message: 'Validation Error! :(',
                    data: errArr,
                });
            } else {
                const project = new projectsModel(obj)
                const result = await project.save()
                res.send({
                    isSuccessfull: true,
                    message: "Data Added Scuccessfully",
                    data: result
                })
            }
        } catch (err) {
            res.send({
                isSuccessfull: false,
                message: "Data not Added",
                data: err
            })
        }
    },
    assignProject: async (req, res) => {
        try {
            const { title, description, dueDate, team, } = req.body;
            const checkTeam = await Team.findById(team);
            if (!checkTeam) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found',
                });
            }
            const newTask = await projectsModel.create({
                title,
                description,
                dueDate,
                team,
            });

            // Update team ke tasks array mein newTask ko push karein
            await Team.findByIdAndUpdate(team, { $push: { projects: newTask } });

            // Update user ke tasks array mein newTask ko push karein
            return res.status(201).json({
                success: true,
                message: 'Task successfully assign kiya gaya hai',
                task: newTask,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Task assign karne mein kuch problem aayi hai',
                error: error.message,
            });
        }
    },
    markAsDone: async (req, res) => {
        try {
            let projectId = req.params.id
            const project = await projectsModel.findByIdAndUpdate(
                projectId,
                { projectStatus: 'completed' },
                { new: true }
            );
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.json(project);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            const { title, description, dueDate } = req.body;
            const obj = { title, description, dueDate };
            const errArr = [];
            if (!obj.title) {
                errArr.push('Required title');
            }
            if (!obj.description) {
                errArr.push('Required description');
            }
            if (!obj.dueDate) {
                errArr.push('Required due date');
            }
            if (errArr.length > 0) {
                res
                    .status(401)
                    .send(SendResponse(false, 'all Crediantials Not Found ', errArr));
            } else {
                const result = await projectsModel.findByIdAndUpdate(id, obj);
                res
                    .status(200)
                    .send(SendResponse(true, 'Updated Successfully', result));
            }
        } catch (error) {
            res.status(404).send(SendResponse(false, error, null));
        }
    },
    del: async (req, res) => {
        const id = req.params.id
        try {
            const result = await projectsModel.findByIdAndDelete(id)
            res.status(200).send(sendResponse(true, "Deleted Successfully", result))
        }
        catch (error) {
            res.status(404).send(sendResponse(false, error, null))
        }
    }
};

module.exports = projectsController;