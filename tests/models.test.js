const assert = require('node:assert/strict');
const test = require('node:test');
const { Assignment, Mission, Spaceship } = require('../src/models/model');

test('spaceship schema trims its name and defines the requested status values', () => {
    const spaceship = new Spaceship({ name: '  Orion  ' });

    assert.equal(spaceship.name, 'Orion');
    assert.equal(spaceship.status, 'available');
    assert.equal(Spaceship.schema.path('name').options.unique, true);
    assert.deepEqual(Spaceship.schema.path('status').enumValues, [
        'available',
        'busy',
        'maintenance',
    ]);
    assert.equal(Spaceship.schema.options.timestamps, true);
});

test('mission schema trims text and defaults to pending', () => {
    const mission = new Mission({
        title: '  Rescue  ',
        destination: '  Mars  ',
        description: '  Assist crew  ',
    });

    assert.equal(mission.title, 'Rescue');
    assert.equal(mission.destination, 'Mars');
    assert.equal(mission.description, 'Assist crew');
    assert.equal(mission.status, 'pending');
    assert.deepEqual(Mission.schema.path('status').enumValues, [
        'pending',
        'assigned',
        'completed',
    ]);
});

test('active assignments have unique partial indexes on shipId and missionId', () => {
    const indexes = Assignment.schema.indexes();
    const shipIndex = indexes.find(([fields]) => fields.shipId === 1);
    const missionIndex = indexes.find(([fields]) => fields.missionId === 1);
    const assignment = new Assignment({
        shipId: new Spaceship()._id,
        missionId: new Mission()._id,
    });

    assert.equal(Assignment.schema.path('shipId').options.ref, 'Spaceship');
    assert.equal(Assignment.schema.path('missionId').options.ref, 'Mission');
    assert.equal(Assignment.schema.path('shipId').isRequired, true);
    assert.equal(Assignment.schema.path('missionId').isRequired, true);
    assert.equal(assignment.status, 'active');
    assert.deepEqual(shipIndex, [
        { shipId: 1 },
        {
            unique: true,
            partialFilterExpression: { status: 'active' },
        },
    ]);
    assert.deepEqual(missionIndex, [
        { missionId: 1 },
        {
            unique: true,
            partialFilterExpression: { status: 'active' },
        },
    ]);
});
