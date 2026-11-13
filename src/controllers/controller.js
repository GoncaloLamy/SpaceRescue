const { Mission, Spaceship } = require('../models/model');

async function getShips(request, response, next) {
    try {
        const spaceships = await Spaceship.find();
        response.status(200).json(spaceships);
    } catch (error) {
        next(error);
    }
}

async function getShipById(request, response, next) {
    try {
        const spaceship = await Spaceship.findById(request.params.id);

        if (!spaceship) {
            const error = new Error('Ship not found');
            error.statusCode = 404;
            next(error);
        }

        response.status(200).json(spaceship);
    } catch (error) {
        next(error);
    }
}

async function createShip(request, response, next) {
    try {
        const spaceship = await Spaceship.create(request.body);
        response.status(201).json(spaceship);
    } catch (error) {
        next(error);
    }
}

async function getMissions(request, response, next) {
    try {
        const missions = await Mission.find();
        response.status(200).json(missions);
    } catch (error) {
        next(error);
    }
}

async function getMissionById(request, response, next) {
    try {
        const mission = await Mission.findById(request.params.id);

        if (!mission) {
            const error = new Error('Mission not found');
            error.statusCode = 404;
            next(error);
        }
        response.status(200).json(mission);
    } catch (error) {
        next(error);
    }
}

async function createMission(request, response, next) {
    try {
        const mission = await Mission.create(request.body);
        response.status(201).json(mission);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getShips,
    getShipById,
    createShip,
    getMissions,
    getMissionById,
    createMission,
};
