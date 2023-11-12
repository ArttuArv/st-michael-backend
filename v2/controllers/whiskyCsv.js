const whiskyCsvRouter = require('express').Router()
const whiskyCsvSql = require('../models/whisky')
const csv = require('csvtojson')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { sortIntoCategories } = require('../../utils/getRequestTransformers')

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

  if (!request.user) 
    return response.status(401).end()

  if (request.file?.path === undefined) {
    return response.status(400).json({ error: 'No file selected' })
  }

  const csvFile = request.file.path

  truncateTables()

  setTimeout(async () => {
    try {
      const whiskyArray = await readCsvFile(csvFile)
      await insertWhiskyAreas(whiskyArray)
      const savedWhiskys = await insertWhiskiesIntoDatabase(whiskyArray)
      deleteFileFromDisk(csvFile)
      response.status(201).json({ message: 'Whiskies added', whiskys: savedWhiskys }).end()
    } catch (error) {
      console.log('Errori:', error)
      response.status(500).json({ error: error.message }).end()
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
  const promises = uniqueAreas.map(async area => {
    try {
      await whiskyCsvSql.createWhiskyArea(area)
    } catch (err) {
      console.log(err)
    }
  })
  await Promise.all(promises)
}

const insertWhiskiesIntoDatabase = async (whiskiesByArea) => {
  const newWhiskys = []

  await Promise.all(whiskiesByArea.map(async (whisky) => {
    const newWhisky = {
      name: whisky.name,
      area: whisky.area,
      price: whisky.price,
    }

    try {
      const result = await whiskyCsvSql.createWhisky(newWhisky)
      newWhisky.whisky_id = result.insertId
      newWhiskys.push(newWhisky)
    } catch (err) {
      console.log(err)
    }
  }))

  return sortIntoCategories(newWhiskys)
}

function deleteFileFromDisk(csvFile) {
  fs.unlink(csvFile, (err) => {
    if (err) {
      console.log(err)
    }
    console.log('File deleted')
  })
}

const getAllWhiskys = async () => {
  return await whiskyCsvSql.getAllWhiskysCsv()
}
