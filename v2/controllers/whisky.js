const whiskyRouter = require('express').Router()
const whiskyCsvSql = require('../models/whisky')
const { sortIntoCategories } = require('../../utils/getRequestTransformers')

whiskyRouter.get('/', (request, response) => {
  
  whiskyCsvSql.getAllWhiskys((err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    const sortedWhiskys = sortIntoCategories(result)
    response.json(sortedWhiskys)
  })
})

whiskyRouter.post('/', async (request, response) => {
  const { name, area, price } = request.body

  if (!request.user) 
    return response.status(401).end()

  if (!name || !area) {
    return response.status(400).json({ error: 'content missing' }).end()
  }

  const newWhisky = {
    name,
    area,
    price,
  }

  try {
    const result = await whiskyCsvSql.createWhisky(newWhisky)
    response.status(201).json({ id: result.insertId, ...newWhisky})
  } catch (err) {
    response.status(400).json({ error: 'whisky not created', message: err.message })
  }
})

whiskyRouter.put('/:id', async (request, response) => {
  const { name, area, price } = request.body

  if (!request.user) 
    return response.status(401).end()

  if (!name || !area) {
    return response.status(400).json({ error: 'content missing' })
  }

  const whisky = {
    id: request.params.id,
    name,
    area,
    price,
  }

  try {
    const result = await whiskyCsvSql.updateWhisky(whisky)
    response.status(201).json({ id: result.insertId, ...whisky})
  } catch (err) {
    response.status(400).json({ error: 'whisky not updated', message: err.message })
  }
})

whiskyRouter.delete('/:id', (request, response) => {  

  if (!request.user) 
    return response.status(401).end()

  whiskyCsvSql.deleteWhisky(request.params.id, (err, result) => {
    if (err) {
      return response.status(404).json({ error: 'whisky not found' })
    }
    response.status(204).end()
  })
})


module.exports = whiskyRouter