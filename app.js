const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { connectDB, listenApp } = require('./utils/dbConn')
const path = require('path')

// v1 routes
const usersRouterV1 = require('./v1/controllers/users')
const loginRouterV1 = require('./v1/controllers/login')
const beerRouterV1 = require('./v1/controllers/beer')
const categoriesRouterV1 = require('./v1/controllers/categories')
const whiskyRouterV1 = require('./v1/controllers/whisky')
const whiskyAreasRouterV1 = require('./v1/controllers/whiskyAreas')
const openingHoursRouterV1 = require('./v1/controllers/openingHours')
const whiskyCsvRouterV1 = require('./v1/controllers/whiskyCsvToMongo')
const liveMusicRouterV1 = require('./v1/controllers/liveMusic')
const refreshRouterV1 = require('./v1/controllers/refresh')
const logoutRouterV1 = require('./v1/controllers/logout')

// v2 routes
const usersRouterV2 = require('./v2/controllers/user')
const beerRouterV2 = require('./v2/controllers/beer')
const whiskyCsvRouterV2 = require('./v2/controllers/whiskyCsv')
const whiskyRouterV2 = require('./v2/controllers/whisky')
const liveEventsRouterV2 = require('./v2/controllers/liveEvents')
const openingHoursRouterV2 = require('./v2/controllers/openinghours')
const loginRouterV2 = require('./v2/controllers/login')
const logoutRouterV2 = require('./v2/controllers/logout')
const refreshRouterV2 = require('./v2/controllers/refresh')

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
// v1 routes
app.use('/api/v1/login', loginRouterV1)
app.use('/api/v1/refresh', refreshRouterV1)
app.use('/api/v1/logout', logoutRouterV1)

// v2 routes
app.use('/api/v2/login', loginRouterV2)
app.use('/api/v2/logout', logoutRouterV2)
app.use('/api/v2/refresh', refreshRouterV2)

app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)

// v1 routes
app.use('/api/v1/users', usersRouterV1)
app.use('/api/v1/beer', beerRouterV1)
app.use('/api/v1/categories', categoriesRouterV1)
app.use('/api/v1/whisky', whiskyRouterV1)
app.use('/api/v1/whiskyareas', whiskyAreasRouterV1)
app.use('/api/v1/csv', whiskyCsvRouterV1)
app.use('/api/v1/openinghours', openingHoursRouterV1)
app.use('/api/v1/livemusic', liveMusicRouterV1)

// Upcoming v2 routes
app.use('/api/v2/users', usersRouterV2)
app.use('/api/v2/beer', beerRouterV2)
app.use('/api/v2/whisky', whiskyRouterV2)
app.use('/api/v2/csv', whiskyCsvRouterV2)
app.use('/api/v2/openinghours', openingHoursRouterV2)
app.use('/api/v2/livemusic', liveEventsRouterV2)

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