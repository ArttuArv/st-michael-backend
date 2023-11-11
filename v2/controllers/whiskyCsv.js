const whiskyCsvRouter = require('express').Router()
const whiskyCsvSql = require('../models/whisky')
const csv = require('csvtojson')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

whiskyCsvRouter.post('/', upload.single('csvfile'), async (request, response) => {

  if (request.file?.path === undefined) {
    return res.status(400).json({ error: 'No file selected' })
  }

  const csvFile = request.file.path

  truncateTables()

  setTimeout(async () => {
    try {
      const whiskyArray = await readCsvFile(csvFile)
      await insertWhiskyAreas(whiskyArray)
      await insertWhiskiesIntoDatabase(whiskyArray)
      response.status(200).send(whiskyArray)
      fs.unlink(csvFile, (err) => {
        if (err) {
          console.log(err)
        }
        console.log('File deleted')
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({ error: error.message })
    }
  }, 500)
 
})

module.exports = whiskyCsvRouter

const readCsvFile = async (csvFile) => {
  return await new Promise((resolve, reject) => {
    csv(
      {
        noheader: false,
        headers: ['name', 'area', 'price'],
        quote: '"',
        delimiter: ';',
        ignoreEmpty: true,
      })
      .fromFile(csvFile)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const truncateTables = () => {
  whiskyCsvSql.truncateWhiskyAndAreaTables((err, result) => {
    if (err) {
      return response.status(500).json({ error: err.message })
    }
    console.log('Tables truncated')
  })
}

const insertWhiskyAreas = async (whiskyArray) => {
  const areas = whiskyArray.map(whisky => whisky.area)
  const uniqueAreas = [...new Set(areas)]
  uniqueAreas.forEach(area => {
    whiskyCsvSql.createWhiskyArea(area, (err, result) => {
      if (err) {
        console.log(err)
      }
      console.log(`Area ${area} inserted`)
    })
  })
}

const insertWhiskiesIntoDatabase = async (whiskiesByArea) => {
  whiskiesByArea.forEach(whisky => {
    const newWhisky = {
      name: whisky.name,
      area: whisky.area,
      price: whisky.price,
    
    }
    whiskyCsvSql.createWhisky(newWhisky, (err, result) => {
      if (err) {
        console.log(err)
      }
    })
  })
}