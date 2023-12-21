const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "first name is required"],
    },
    lastName: {
        type: String,
        required: [true, "last name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    contact: {
        type: Number,
        required: [true, "Contact number is optional"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required is optional"],
    },
    userStatus: {
        type: String,
        enum: ['TeamMember', 'User'],
        default: 'User'
    },
},
    {
        timestamps: true
    })

const userModel = mongoose.model("users", userSchema)
module.exports = userModel