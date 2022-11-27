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

  // const csvFilePath = path.join(__dirname, '../public/uploads/' + req.file.originalname)
  console.log("PATH: ", req.file?.path)
  const csvFile = req.file.path

  // Muista laittaa tokenihommat tänne

  if (csvFile === undefined) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

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

      // Separate whiskies different arrays by area
      const whiskiesByArea = createWhiskyObjectsSeparatedByArea(response)

      // Save whiskies to database using insertMany
      Object.keys(whiskiesByArea).forEach(async (area) => {
        const whiskyArea = await WhiskyAreas.findOne({ name: area })
        const whiskies = whiskiesByArea[area]
        const savedWhiskies = await Whisky.insertMany(whiskies)
        whiskyArea.whiskies = whiskyArea.whiskies.concat(savedWhiskies.map(whisky => whisky._id))
        await whiskyArea.save()
      })
     
      return res.status(200).json({ totalWhiskiesInserted: response.length, message: whiskiesByArea })

    })
    .catch((err) => {
      return res.status(400).json({ error: 'Error parsing csv file' })
    })
})


module.exports = whiskyCsvRouter

const truncateWhiskyCollections = () => {
  Whisky.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Collection truncated')
    }
  })
}

const createWhiskyAreaIfNotExists = (response) => {
  const whiskyAreas = response.map((whisky) => whisky.area)
  const uniqueWhiskyAreas = [...new Set(whiskyAreas)]

  // Check if whisky area exists in database and create if not
  uniqueWhiskyAreas.forEach(async (area) => {
    if (await WhiskyAreas.findOne({ name: area })) {
      console.log("Area already exists")
    } else {
      const whiskyAreas = new WhiskyAreas({
        name: area,
      })
      await whiskyAreas.save()
    }
  })
}

const createWhiskyObjectsSeparatedByArea = (response) => {
  return response.reduce((acc, whisky) => {

    const key = whisky.area

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(new Whisky(
      {
        name: whisky.name,
        area: whisky.area,
        price: whisky.price,
      }
    ))

    return acc

  }, {})
}

