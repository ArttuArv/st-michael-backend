const whiskyCsvRouter = require('express').Router()
const csv = require('csvtojson')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const {
  truncateWhiskyCollections,
  truncateWhiskyAreasCollection,
  createWhiskyAreaIfNotExists,
  createWhiskyObjectsSeparatedByArea,
  insertWhiskiesIntoDatabase,
  deleteAllWhiskyAreasNotInCsv,
} = require('../utils/csvToMongoUtils')

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

  if (!req.user) {
    return res.status(401).end()
  }

  if (req.file?.path === undefined) {
    return res.status(400).json({ error: 'No file selected' })
  } 

  const csvFile = req.file.path

  await truncateWhiskyCollections()
  .then(() =>
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

        await createWhiskyAreaIfNotExists(response)
        const whiskiesByArea = await createWhiskyObjectsSeparatedByArea(response)
        await insertWhiskiesIntoDatabase(whiskiesByArea)
        await deleteAllWhiskyAreasNotInCsv(whiskiesByArea)
        return res.status(200).send(response)

      })
      .then(() => removeFileFromDisk(csvFile))
      .catch((err) => {
        console.log(err)
        return res.status(400).json({ error: 'Error parsing csv file' })
      })
  )
})


module.exports = whiskyCsvRouter

function removeFileFromDisk(csvFile) {
  fs.unlink(csvFile, (err) => {
    if (err)
      console.error(err)
  })
}
