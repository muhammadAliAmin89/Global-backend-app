const sendResponse = require("../helper/helper")
const userModel = require("../models/authModel")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const info = require("../utils/sendMail")
require("dotenv").config()


const authController = {
    signup: async (req, res) => {
        try {
            let { firstName, lastName, email, password, contact, dateOfBirth, gender, token } = req.body
            let obj = { firstName, lastName, email, password, contact, dateOfBirth, gender, token }

            let errorArray = []
            if (!obj.firstName) {
                errorArray.push("First name is required")
            }
            if (!obj.lastName) {
                errorArray.push("Last name is required")
            }
            if (!obj.email) {
                errorArray.push("Email address is required")
            }
            if (!obj.password) {
                errorArray.push("Password is required")
            }
            if (!obj.contact) {
                errorArray.push("Contact number is required")
            }
            if (!obj.dateOfBirth) {
                errorArray.push("Date of birth is required")
            }
            if (!obj.gender) {
                errorArray.push("gender is required")
            }
            if (errorArray.length > 0) {
                res
                    .status(401).send(sendResponse(false, "Validation error found !", errorArray))
                return
            }
            let userExist = await userModel.findOne({ email: obj.email })
            if (userExist) {
                res
                    .status(403)
                    .send(sendResponse(false, "User is already exist with this email", null))
                return
            }
            const verificationToken = crypto.randomBytes(5).toString('hex');
            obj.password = await bcrypt.hash(obj.password, 10)
            let user = await new userModel({ ...obj, verificationToken: verificationToken });
            await user.save()
            info("Please verify your email", "Email verification", user.email, `
            <div>
                <p>${verificationToken}</p>                
            </div>`);

            res.send(sendResponse(true, "Email sent! Check your email for verification", user));

        } catch (error) {
            console.log(error);
            res.status(500).send(sendResponse(false, "Internal server error found !", error))
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const { verificationToken } = req.body;
            const user = await userModel.findOne({ verificationToken: verificationToken });
            if (!user) {
                return res.status(401).send(sendResponse(false, "Invalid verification token.", null));
            }
            user.verified = true;
            await user.save();
            res.send(sendResponse(true, "Email successfully verified!", user));
        } catch (error) {
            console.log(error);
            res.status(500).send(sendResponse(false, "Internal server error found!", error));
        }
    },
    login: async (req, res) => { 
        try {
            let { email, password } = req.body
            let obj = { email, password }
            let errorArray = []
            if (!obj.email) {
                errorArray.push("Email address is required")
            }
            if (!obj.password) {
                errorArray.push("Password is required")
            }
            if (errorArray.length > 0) {
                res.status(401).send(sendResponse(false, "Credentials not found", errorArray))
            }
            else {
                let existingUser = await userModel.findOne({ email: obj.email })
                if (existingUser) {
                    const validPass = await bcrypt.compare(obj.password, existingUser.password)
                    if (validPass) {
                        res.status(200).send(sendResponse(true, "User login successfully", existingUser))
                    } else {
                        res.status(401).send(sendResponse(false, "Password is not crrect , please enter valid password", null))
                    }
                } else {
                    res.status(400).send(sendResponse(false, "User is not exist with this email address", null))
                }
            }
        } catch (error) {
            res.status(500).send(sendResponse(false, "Internal server error", error))
        }
    },
    getUsers: async (req, res) => {
        try {
            const allUsers = await userModel.find()
            res.status(200).send(sendResponse(true, 'all Users', allUsers))
        }
        catch (error) {
            res.status(404).send(sendResponse(true, 'You are No Rights for this Action', error))
        }
    },
    markAsTeamMember: async (req, res) => {
        try {
            let userId = req.params.id
            const user = await userModel.findByIdAndUpdate(
                userId,
                { userStatus: 'TeamMember' },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },


}

module.exports = authController