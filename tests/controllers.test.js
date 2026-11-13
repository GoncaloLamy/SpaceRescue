const assert = require('node:assert/strict');
const test = require('node:test');
const mongoose = require('mongoose');
const app = require('../src/app');
const { Mission, Spaceship } = require('../src/models/model');

test('ship and mission routes create and read records with the requested statuses', async () => {
    const originalMethods = {
        spaceshipFind: Spaceship.find,
        spaceshipFindById: Spaceship.findById,
        spaceshipCreate: Spaceship.create,
        missionFind: Mission.find,
        missionFindById: Mission.findById,
        missionCreate: Mission.create,
        consoleError: console.error,
    };
    const seededShips = [
        { _id: 'ship-1', name: 'Orion', type: 'Rescue' },
        { _id: 'ship-2', name: 'Voyager', type: 'Explorer' },
        { _id: 'ship-3', name: 'Discovery', type: 'Research' },
    ];
    const seededMissions = [
        { _id: 'mission-1', title: 'Mars Mission', destination: 'Mars' },
        { _id: 'mission-2', title: 'Moon Mission', destination: 'Moon' },
        { _id: 'mission-3', title: 'Jupiter Mission', destination: 'Jupiter' },
    ];

    Spaceship.find = async () => seededShips;
    Spaceship.findById = async (id) => {
        if (id === 'invalid') {
            throw new mongoose.Error.CastError('ObjectId', id, '_id');
        }

        return id === 'missing' ? null : seededShips[0];
    };
    Spaceship.create = async (data) => {
        if (data.name === 'Orion') {
            const error = new Error('Duplicate ship name');
            error.code = 11000;
            throw error;
        }

        const spaceship = new Spaceship(data);
        await spaceship.validate();
        return spaceship;
    };
    Mission.find = async () => seededMissions;
    Mission.findById = async (id) => {
        if (id === 'invalid') {
            throw new mongoose.Error.CastError('ObjectId', id, '_id');
        }

        return id === 'missing' ? null : seededMissions[0];
    };
    Mission.create = async (data) => {
        const mission = new Mission(data);
        await mission.validate();
        return mission;
    };
    console.error = () => {};

    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));

    try {
        const baseUrl = `http://127.0.0.1:${server.address().port}/api`;
        let response = await fetch(`${baseUrl}/ships`);
        assert.equal(response.status, 200);
        assert.equal((await response.json()).length, 3);

        response = await fetch(`${baseUrl}/ships/ship-1`);
        assert.equal(response.status, 200);
        assert.equal((await response.json()).name, 'Orion');

        response = await fetch(`${baseUrl}/ships/missing`);
        assert.equal(response.status, 404);
        assert.deepEqual(await response.json(), {
            error: 'Not Found',
            message: 'Ship not found',
        });

        response = await fetch(`${baseUrl}/ships/invalid`);
        assert.equal(response.status, 400);

        response = await fetch(`${baseUrl}/ships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'New Ship', type: 'Rescue' }),
        });
        assert.equal(response.status, 201);

        response = await fetch(`${baseUrl}/ships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Orion', type: 'Rescue' }),
        });
        assert.equal(response.status, 409);

        response = await fetch(`${baseUrl}/missions`);
        assert.equal(response.status, 200);
        assert.equal((await response.json()).length, 3);

        response = await fetch(`${baseUrl}/missions/mission-1`);
        assert.equal(response.status, 200);
        assert.equal((await response.json()).title, 'Mars Mission');

        response = await fetch(`${baseUrl}/missions/missing`);
        assert.equal(response.status, 404);

        response = await fetch(`${baseUrl}/missions/invalid`);
        assert.equal(response.status, 400);

        response = await fetch(`${baseUrl}/missions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Mission', destination: 'Mars' }),
        });
        assert.equal(response.status, 201);

        response = await fetch(`${baseUrl}/missions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destination: 'Mars' }),
        });
        assert.equal(response.status, 400);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        Spaceship.find = originalMethods.spaceshipFind;
        Spaceship.findById = originalMethods.spaceshipFindById;
        Spaceship.create = originalMethods.spaceshipCreate;
        Mission.find = originalMethods.missionFind;
        Mission.findById = originalMethods.missionFindById;
        Mission.create = originalMethods.missionCreate;
        console.error = originalMethods.consoleError;
    }
});
