function errorHandler(error, request, response, next) {
    console.error(error);
    response.status(error.statusCode || error.status || 500).json({
        message: error.message,
    });
}

module.exports = errorHandler;
