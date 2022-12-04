const Whisky = require('../models/whisky')
const WhiskyAreas = require('../models/whiskyareas')
const whiskyCsvRouter = require('express').Router()
const csv = require('csvtojson')
const multer = require('multer')
const path = require('path')
const { 
  truncateWhiskyCollections, 
  createWhiskyAreaIfNotExists, 
  createWhiskyObjectsSeparatedByArea, 
  insertWhiskiesIntoDatabase,
  deleteAllWhiskyAreasNotInCsv,
  compareInsertedWhiskiesCountWithCsvCountUsingLoop } = require('../utils/csvToMongoUtils')

// Multer and csv to mongoDB middlewares
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

whiskyCsvRouter.post('/', upload.single('csvfile'), async (req, res) => {

  if (req.file?.path === undefined) {
    return res.status(400).json({ error: 'No file selected' })
  }
  
  const csvFile = req.file.path

  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  truncateWhiskyCollections()  

  csv(
    {
      noheader: false,
      headers: ['name', 'area', 'price'],
      quote: '"',
      delimiter: ';',
      ignoreEmpty: true,
    })
    .fromFile(csvFile)
    .then(async (response) => {

      const whiskyAreaCount = createWhiskyAreaIfNotExists(response)
      const whiskiesByArea = createWhiskyObjectsSeparatedByArea(response)

      compareInsertedWhiskiesCountWithCsvCountUsingLoop(whiskyAreaCount)
      
      insertWhiskiesIntoDatabase(whiskiesByArea)
      deleteAllWhiskyAreasNotInCsv(whiskiesByArea)
     
      return res.status(200).send( response )

    })
    .catch((err) => {
      console.log(err)
      return res.status(400).json({ error: 'Error parsing csv file' })
    })
})


module.exports = whiskyCsvRouter