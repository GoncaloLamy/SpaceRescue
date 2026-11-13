const assert = require('node:assert/strict');
const test = require('node:test');
const seedDatabase = require('../scripts/seed');

function createFakeModel(idPrefix) {
    const records = new Map();

    return {
        records,
        async findOneAndUpdate(filter, update, options) {
            assert.equal(options.upsert, true);

            const key = Object.values(filter).join(':');

            if (!records.has(key)) {
                records.set(key, {
                    _id: `${idPrefix}-${records.size + 1}`,
                    ...update.$setOnInsert,
                });
            }

            return records.get(key);
        },
    };
}

test('running the seed repeatedly creates no duplicate ships, missions, or assignments', async () => {
    const models = {
        Spaceship: createFakeModel('ship'),
        Mission: createFakeModel('mission'),
        Assignment: createFakeModel('assignment'),
    };

    await seedDatabase(models);
    await seedDatabase(models);

    const spaceships = [...models.Spaceship.records.values()];
    const missions = [...models.Mission.records.values()];
    const assignments = [...models.Assignment.records.values()];

    assert.deepEqual(spaceships.map(({ name }) => name), ['Orion', 'Voyager', 'Discovery']);
    assert.deepEqual(missions.map(({ title }) => title), [
        'Mars Mission',
        'Moon Mission',
        'Jupiter Mission',
    ]);
    assert.deepEqual(missions.map(({ status }) => status), ['assigned', 'assigned', 'completed']);
    assert.equal(assignments.length, 3);
    assert.deepEqual(assignments.map(({ status }) => status), ['active', 'active', 'completed']);
    assert.deepEqual(assignments.map(({ shipId, missionId }) => [shipId, missionId]), [
        ['ship-1', 'mission-1'],
        ['ship-2', 'mission-2'],
        ['ship-3', 'mission-3'],
    ]);
});
