const express = require('express')
const mongoose = require("mongoose")
const App = express()
App.use(express.json())
require('dotenv').config();
const teamRoute = require("./router/teamRoute")
// Work
const authRoute = require("./router/authRouter")
const projectsRoute = require("./router/projectRoute")
App.use("/auth", authRoute)
App.use("/projects", projectsRoute)
App.use("/teams", teamRoute)

App.get("/", (req, res) => {
    res.send("Server Started");
});

// server
mongoose
    .connect(process.env.MONGO_URI)
    .then((res) => {
        App.listen(process.env.PORT, () => {
            console.log(
                `Database Connected and server is listening http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((err) => {
        console.log("err", err.error);
    });
