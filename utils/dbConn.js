const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./config')
const app = require('../app')

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
  }).then(() => {
    console.log('connected to MongoDB')
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
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