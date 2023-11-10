require('dotenv').config()

const PORT = process.env.PORT || 8080 //3003

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI

const SQL_CONNECTION = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
}

module.exports = {
  MONGODB_URI,
  PORT,
  SQL_CONNECTION
}