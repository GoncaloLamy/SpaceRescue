const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const router = require('./routes/router');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(router);
app.use((request, response, next) => {
    const error = new Error(`Route not found: ${request.originalUrl}`);
    error.statusCode = 404;
    next(error);
});
app.use(errorHandler);

if (require.main === module) {
    mongoose.connect('mongodb://127.0.0.1:27017/spacerescueDB')
        .then(() => {
            console.log('MongoDB tilsluttet');
            console.log("Serveren kører på http://localhost:3000");
            app.listen(3000);
        })
        .catch((error) => {
            console.error('MongoDB connection failed:', error);
            process.exitCode = 1;
        });
}

module.exports = app;
