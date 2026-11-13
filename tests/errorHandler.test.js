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
        error: 'Internal Server Error',
        message: 'Unexpected error',
    });
});

test('Mongoose validation and cast errors return 400 responses', () => {
    for (const name of ['ValidationError', 'CastError']) {
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
        const error = new Error('Invalid input');
        error.name = name;

        errorHandler(error, {}, response, () => {});

        assert.equal(statusCode, 400);
        assert.deepEqual(responseBody, {
            error: 'Bad Request',
            message: 'Invalid input',
        });
    }
});

test('duplicate key errors return a 409 response', () => {
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

    errorHandler({ code: 11000, message: 'Duplicate name' }, {}, response, () => {});

    assert.equal(statusCode, 409);
    assert.deepEqual(responseBody, {
        error: 'Conflict',
        message: 'Duplicate name',
    });
});
