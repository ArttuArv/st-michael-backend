const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const beerRouter = require('./controllers/beer')
const categoriesRouter = require('./controllers/categories')
const whiskyRouter = require('./controllers/whisky')
const whiskyAreasRouter = require('./controllers/whiskyAreas')
const openingHoursRouter = require('./controllers/openingHours')

const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor } = require('./utils/middleware')

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(requestLogger)

// Routes and middlewares
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/beer', beerRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/whisky', whiskyRouter)
app.use('/api/whiskyareas', whiskyAreasRouter)
app.use('/api/openinghours', openingHoursRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app