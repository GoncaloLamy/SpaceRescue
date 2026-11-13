const mongoose = require('mongoose');

const spaceshipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'maintenance'],
        default: 'available',
    },
}, {
    timestamps: true,
});

const missionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'assigned', 'completed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const assignmentSchema = new mongoose.Schema({
    shipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Spaceship',
        required: true,
    },
    missionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

assignmentSchema.index(
    { shipId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' },
    },
);
assignmentSchema.index(
    { missionId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' },
    },
);

module.exports = {
    Spaceship: mongoose.model('Spaceship', spaceshipSchema),
    Mission: mongoose.model('Mission', missionSchema),
    Assignment: mongoose.model('Assignment', assignmentSchema),
};