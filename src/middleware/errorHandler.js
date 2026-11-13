function errorHandler(error, request, response, next) {
    console.error(error);
    let statusCode = error.statusCode || error.status || 500;

    if (error.name === 'CastError' || error.name === 'ValidationError') {
        statusCode = 400;
    } else if (error.code === 11000) {
        statusCode = 409;
    }

    const errorNames = {
        400: 'Bad Request',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error',
    };

    response.status(statusCode).json({
        error: errorNames[statusCode] || 'Internal Server Error',
        message: error.message,
    });
}

module.exports = errorHandler;
