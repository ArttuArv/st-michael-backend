const mongoose = require('mongoose')
const mysql = require('mysql2')
const { MONGODB_URI, PORT, SQL_CONNECTION } = require('./config')
const app = require('../app')
mongoose.set('strictQuery', false)

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
  }).then(() => {
    console.log('connected to MongoDB')
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const mySqlConnection = mysql.createConnection(SQL_CONNECTION)

  mySqlConnection.connect((err) => {
    if (err) {
      console.log('error connecting to MySQL:', err.message)
      return
    }
    console.log('connected to MySQL')
  })
}

const listenApp = (app) => {
  mongoose.connection.once('open', () => {
    console.log('MongoDB connection established successfully')
    app.listen(PORT || 8080, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
}

module.exports = { connectDB, listenApp }