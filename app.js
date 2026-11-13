const express = require('express')
const spaceshipRoutes = require('./src/routes/spaceshipRoutes')
const errorHandler = require('./src/middleware/errorHandler')

const app = express()

app.use(express.json())
app.use('/api', spaceshipRoutes)
app.use(errorHandler)

module.exports = app
