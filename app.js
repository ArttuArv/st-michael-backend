const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { connectDB, listenApp } = require('./utils/dbConn')
const path = require('path')

const usersRouter = require('./v1/controllers/users')
const loginRouter = require('./v1/controllers/login')
const beerRouter = require('./v1/controllers/beer')
const categoriesRouter = require('./v1/controllers/categories')
const whiskyRouter = require('./v1/controllers/whisky')
const whiskyAreasRouter = require('./v1/controllers/whiskyAreas')
const openingHoursRouter = require('./v1/controllers/openingHours')
const whiskyCsvRouter = require('./v1/controllers/whiskyCsvToMongo')
const liveMusicRouter = require('./v1/controllers/liveMusic')
const refreshRouter = require('./v1/controllers/refresh')
const logoutRouter = require('./v1/controllers/logout')

const logger = require('./utils/logger')
const { 
  requestLogger, 
  unknownEndpoint, 
  errorHandler, 
  tokenExtractor, 
  userExtractor, 
  credentials, 
} = require('./utils/middleware')
const corrsOptions = require('./utils/corsOptions')

const frontSendFile = (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
}

connectDB()

// Dev
// app.use(credentials)
// app.use(cors(corrsOptions))

// Prod
app.use(cors({
  origin: './build',
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.static('build'))
app.use(express.static(path.resolve(__dirname, 'public')))


// Routes and middlewares
app.use('/api/login', loginRouter)
app.use('/api/refresh', refreshRouter)
app.use('/api/logout', logoutRouter)

app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/users', usersRouter)
app.use('/api/beer', beerRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/whisky', whiskyRouter)
app.use('/api/whiskyareas', whiskyAreasRouter)
app.use('/api/csv', whiskyCsvRouter)
app.use('/api/openinghours', openingHoursRouter)
app.use('/api/livemusic', liveMusicRouter)

// Upcoming v2 routes
app.use('/api/v2/users', usersRouter)
app.use('/api/v2/beer', beerRouter)
app.use('/api/v2/categories', categoriesRouter)
app.use('/api/v2/whisky', whiskyRouter)
app.use('/api/v2/whiskyareas', whiskyAreasRouter)
app.use('/api/v2/csv', whiskyCsvRouter)
app.use('/api/v2/openinghours', openingHoursRouter)
app.use('/api/v2/livemusic', liveMusicRouter)

// Frontend Routes
app.get('/', (req, res) => {
  frontSendFile(req, res)
})
app.get('/login', (req, res) => {
  frontSendFile(req, res)
})
app.get('/admin', (req, res) => {
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
app.get('*', (req, res) => {
  frontSendFile(req, res)
})

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

listenApp(app)

module.exports = app