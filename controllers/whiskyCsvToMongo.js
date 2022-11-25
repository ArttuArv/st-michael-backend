const Whisky = require('../models/whisky')
const WhiskyAreas = require('../models/whiskyareas')
const whiskyCsvRouter = require('express').Router()
const csv = require('csvtojson')
const multer = require('multer')
const path = require('path')

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
  let whiskyResponse = []
  // const csvFilePath = path.join(__dirname, '../public/uploads/' + req.file.originalname)
  console.log("PATH: ", req.file?.path)
  const csvFile = req.file.path
  // Muista laittaa tokenihommat tänne

  if (csvFile === undefined) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  csv()
    .fromFile(csvFile)
    .then((response) => {

      console.log("response: ", response)
      return res.status(200).json(response)
      // for (let i = 0; i < response; i++) {
      //   whiskyResponse = parseFloat(response[i].name)
      //   response[i].name = whiskyResponse
      //   whiskyResponse = parseFloat(response[i].area)
      //   response[i].area = whiskyResponse
      //   whiskyResponse = parseFloat(response[i].price)
      //   response[i].price = whiskyResponse
      // }

      // Whisky.insertMany(response, (err, data) => {
      //   if (err) {
      //     res.status(400).json({ error: err })
      //   } else {
      //     res.status(201).json(data)
      //   }
      // })
    })
})

module.exports = whiskyCsvRouter