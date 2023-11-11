const beerRouter = require('express').Router()
const beerSql = require('../models/beer')

beerRouter.get('/:id', (request, response) => {
  beerSql.getBeer(request.params.id, (err, result) => {
    if (err) {
      return response.status(404).json({ error: 'beer not found' })
    }
    
    const beer = result.length > 0 ? result[0] : null
    response.json(beer)
  })
})

beerRouter.get('/', (request, response) => {
  beerSql.getBeers((err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    const sortedBeers = sortIntoCategories(result)
    response.json(sortedBeers)
  })
})

beerRouter.post('/', (request, response) => {
  const { name, style, country, category } = request.body

  if (!name || !style || !country || !category) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newBeer = {
    name,
    style,
    country,
    category,
  }

  beerSql.createBeer(newBeer, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'beer not created', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...newBeer })
  })
})

beerRouter.put('/:id', (request, response) => {
  const { name, style, country, category } = request.body

  if (!name || !style || !country || !category) {
    return response.status(400).json({ error: 'content missing' })
  }

  const beer = {
    id: request.params.id,
    name,
    style,
    country,
    category,
  }

  beerSql.updateBeer(beer, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'beer not updated', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...beer })
  })
})

beerRouter.delete('/:id', (request, response) => {
  beerSql.deleteBeer(request.params.id, (err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    if (result.affectedRows === 0) {
      return response.status(404).json({ error: 'beer not found' })
    }
    response.status(204).end()
  })
})

module.exports = beerRouter

const sortIntoCategories = (beers) => {
  // Create an empty object to store the transformed result
  const transformedResult = {};

  // Iterate through the actual result array
  beers.forEach(beer => {
    // Extract relevant information
    const { category_id, category, beer_id, name, style, country } = beer;

    // Check if the category exists in the transformed result object
    if (!transformedResult[category]) {
      // If not, create a new entry for the category
      transformedResult[category] = {
        id: category_id,
        category: category,
        products: []
      };
    }

    // Add the beer details to the products array of the category
    transformedResult[category].products.push({
      id: beer_id,
      name: name,
      style: style,
      country: country
    });
  });

  // Convert the transformed result object into an array of categories
  return Object.values(transformedResult);
}