const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Endpoint findes ikke' }));

app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/spacerescueDB')
    .then(() => {
        console.log('MongoDB tilsluttet');
        app.listen(3000, () => console.log('Server klar på http://localhost:3000'));
    })
    .catch((err) => {
        console.error('MongoDB fejl:', err.message);
        process.exit(1);
    });