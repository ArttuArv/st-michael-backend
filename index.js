const app = require('./app')
const http = require('http')
const logger = require('./utils/logger')

const server = http.createServer(app)