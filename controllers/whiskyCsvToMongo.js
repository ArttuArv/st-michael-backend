const Whisky = require('../models/whisky')
const WhiskyAreas = require('../models/whiskyareas')
const whiskyCsvRouter = require('express').Router()
const csv = require('csvtojson')
const multer = require('multer')
const path = require('path')
const { errorHandler } = require('../utils/middleware')
const { 
  truncateWhiskyCollections, 
  createWhiskyAreaIfNotExists, 
  createWhiskyObjectsSeparatedByArea, 
  insertWhiskiesIntoDatabase } = require('../utils/csvToMongoUtils')

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
  // const csvFilePath = path.join(__dirname, '../public/uploads/' + req.file.originalname)
  console.log("PATH: ", req.file?.path)
  const csvFile = req.file.path

  // Muista laittaa tokenihommat tänne

  // Truncate the Whisky collection
  truncateWhiskyCollections()

  csv(
    {
      noheader: false,
      headers: ['name', 'area', 'price'],
      delimiter: ';',
      ignoreEmpty: true,
    })
    .fromFile(csvFile)
    .then((response) => {

      createWhiskyAreaIfNotExists(response)

      const whiskiesByArea = createWhiskyObjectsSeparatedByArea(response)

      insertWhiskiesIntoDatabase(whiskiesByArea)
     
      return res.status(200).json({ totalWhiskiesInserted: response.length, uploadedWhiskies: whiskiesByArea })
    })
    .catch((err) => {
      return res.status(400).json({ error: 'Error parsing csv file' })
    })
})


module.exports = whiskyCsvRouter