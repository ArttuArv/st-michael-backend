require('dotenv').config()

const PORT = process.env.PORT || 8080 //3003

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SQL_CONNECTION = process.env.NODE_ENV === 'test'
  ? {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.TEST_SQL_DATABASE
  }
  : {
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