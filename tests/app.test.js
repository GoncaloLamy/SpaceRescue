const assert = require('node:assert/strict');
const test = require('node:test');
const app = require('../src/app');

test('unknown routes return a JSON 404 response', async () => {
    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));

    try {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/missing`);

        assert.equal(response.status, 404);
        assert.deepEqual(await response.json(), {
            error: 'Not Found',
            message: 'Route not found: /missing',
        });
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
    }
});
