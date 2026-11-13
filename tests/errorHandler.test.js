const assert = require('node:assert/strict');
const test = require('node:test');
const errorHandler = require('../src/middleware/errorHandler');

test('errors without a status code return a JSON 500 response', () => {
    let statusCode;
    let responseBody;
    const response = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(body) {
            responseBody = body;
        },
    };

    errorHandler(new Error('Unexpected error'), {}, response, () => {});

    assert.equal(statusCode, 500);
    assert.deepEqual(responseBody, {
        message: 'Unexpected error',
    });
});
