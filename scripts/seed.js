const mongoose = require('mongoose');
const {
    Spaceship,
    Mission,
    Assignment,
} = require('../src/models/model');

const spaceships = [
    { name: 'Orion' },
    { name: 'Voyager' },
    { name: 'Discovery' },
];

const missions = [
    {
        title: 'Mars Mission',
        destination: 'Mars',
        description: 'Rescue crew near Mars',
        status: 'assigned',
    },
    {
        title: 'Moon Mission',
        destination: 'Moon',
        description: 'Survey the lunar surface',
        status: 'assigned',
    },
    {
        title: 'Jupiter Mission',
        destination: 'Jupiter',
        description: "Explore Jupiter's atmosphere",
        status: 'completed',
    },
];

const assignments = [
    { shipName: 'Orion', missionTitle: 'Mars Mission', status: 'active' },
    { shipName: 'Voyager', missionTitle: 'Moon Mission', status: 'active' },
    { shipName: 'Discovery', missionTitle: 'Jupiter Mission', status: 'completed' },
];

const upsertOptions = {
    upsert: true,
    returnDocument: 'after',
    setDefaultsOnInsert: true,
};

async function seedDatabase(models = { Spaceship, Mission, Assignment }) {
    const seededSpaceships = new Map();
    const seededMissions = new Map();

    for (const spaceship of spaceships) {
        const savedSpaceship = await models.Spaceship.findOneAndUpdate(
            { name: spaceship.name },
            { $setOnInsert: spaceship },
            upsertOptions,
        );
        seededSpaceships.set(spaceship.name, savedSpaceship);
    }

    for (const mission of missions) {
        const savedMission = await models.Mission.findOneAndUpdate(
            { title: mission.title },
            { $setOnInsert: mission },
            upsertOptions,
        );
        seededMissions.set(mission.title, savedMission);
    }

    for (const assignment of assignments) {
        const spaceship = seededSpaceships.get(assignment.shipName);
        const mission = seededMissions.get(assignment.missionTitle);

        await models.Assignment.findOneAndUpdate(
            { shipId: spaceship._id, missionId: mission._id },
            {
                $setOnInsert: {
                    shipId: spaceship._id,
                    missionId: mission._id,
                    status: assignment.status,
                },
            },
            upsertOptions,
        );
    }
}

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/spacerescueDB');

    try {
        await seedDatabase();
    } finally {
        await mongoose.disconnect();
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}

module.exports = seedDatabase;
