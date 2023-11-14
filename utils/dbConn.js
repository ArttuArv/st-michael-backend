const mongoose = require('mongoose')
const mysql = require('mysql2')
const { MONGODB_URI, PORT, SQL_CONNECTION } = require('./config')
mongoose.set('strictQuery', false)

const pool = {
  ...SQL_CONNECTION,
  waitForConnections: true,
  connectionLimit: 5,
  idleTimeout: 120000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000,
}

const mySqlConnection = mysql.createPool(pool)

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
  }).then(() => {
    console.log('connected to MongoDB')
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  mysql.createPool(pool)
  console.log('connected to MySQL')
}

const listenApp = (app) => {
  mongoose.connection.once('open', () => {
    console.log('MongoDB connection established successfully')
    app.listen(PORT || 8080, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
}

module.exports = { connectDB, listenApp, mySqlConnection }