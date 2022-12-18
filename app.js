const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const beerRouter = require('./controllers/beer')
const categoriesRouter = require('./controllers/categories')
const whiskyRouter = require('./controllers/whisky')
const whiskyAreasRouter = require('./controllers/whiskyAreas')
const openingHoursRouter = require('./controllers/openingHours')
const whiskyCsvRouter = require('./controllers/whiskyCsvToMongo')

const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor } = require('./utils/middleware')

const frontSendFile = (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
}

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
app.use(express.static(path.resolve(__dirname, 'public')))
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
app.use('/api/csv', whiskyCsvRouter)
app.use('/api/openinghours', openingHoursRouter)

// Frontend Routes
app.get('/', (req, res) => {
  frontSendFile(req, res)
})
app.get('/login', (req, res) => {
  frontSendFile(req, res)
})
app.get('/beer', (req, res) => {
  frontSendFile(req, res)
})
app.get('/whisky', (req, res) => {
  frontSendFile(req, res)
})
app.get('/story', (req, res) => {
  frontSendFile(req, res)
})
app.get('/sports', (req, res) => {
  frontSendFile(req, res)
})

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app