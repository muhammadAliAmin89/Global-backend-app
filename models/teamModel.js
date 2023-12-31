const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
