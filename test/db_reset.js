const mongoose = require('mongoose')
const logger = require('../utils/logger')


// clear mongodb tables
const Beer = require('../models/beer')
const Categories = require('../models/categories')

console.log('MONGODB_URI: ', process.env.MONGODB_URI )


// connect to mongodb
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')

    Beer.deleteMany({}, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('beers deleted')
      }
    })
    
    Categories.deleteMany({}, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('categories deleted')
      }
    })
    
    console.log('Database cleared')

  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

