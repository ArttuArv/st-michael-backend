const Categories = require('../models/categories')
const categoriesRouter = require('express').Router()

categoriesRouter.get('/', async (request, response) => {
  const categories = await Categories.find({}).populate('products', { name: 1, style: 1, country: 1, price: 1, category: 1 })
  response.json(categories)
})

categoriesRouter.post('/', async (request, response) => {
  const { name, } = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const categories = new Categories({
    name,
  })

  const savedCategories = await categories.save()

  response.status(201).json(savedCategories)
})

categoriesRouter.delete('/:id', async (request, response) => {
  const categoriesToDelete = await Categories.findById(request.params.id)

  if (categoriesToDelete) {
    if (request.user) {
      await Categories.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'Token missing or invalid' })
    }
  } else {
    response.status(404).json({ error: 'category not found' })
  }
})

module.exports = categoriesRouter;