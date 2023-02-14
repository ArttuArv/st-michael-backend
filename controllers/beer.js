const Beer = require('../models/beer')
const Categories = require('../models/categories')
const beerRouter = require('express').Router()

beerRouter.get('/', async (request, response) => {
  const beers = await Beer.find({}).populate('category', { name: 1, })
  response.json(beers)
})

beerRouter.post('/', async (request, response) => {
  const { name, style, country, price, category } = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  } else {
    if (category === 'On Bottle' || category === 'On Draught' || category === 'Local Draughts' || category === 'Regular Draughts') {
      
      const dbCategory = await Categories.findOne({ name: category })
      
      const beer = new Beer({
        name,
        style,
        country,
        price,
        category: dbCategory.name,
      })
    
      const savedBeer = await beer.save()
  
      dbCategory.products = dbCategory.products.concat(savedBeer._id)
      await dbCategory.save()
    
      response.status(201).json(savedBeer)
    } else {    
      return response.status(400).json({ error: 'Category must be On Bottle, On Draught, Local Draughts or Regular Draughts' })
    }  
  }  
})

beerRouter.delete('/:id', async (request, response) => {
  const beerToDelete = await Beer.findById(request.params.id)

  if (beerToDelete) {
    if (request.user) {
      await Beer.findByIdAndRemove(request.params.id)

      const category = await Categories.findOne({ name: beerToDelete.category })
      category.products = category.products.filter(product => product.toString() !== beerToDelete._id.toString())
      await category.save()
      
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'Token missing or invalid' })
    }
  } else {
    response.status(404).json({ error: 'beer not found' })
  }
})

module.exports = beerRouter;

