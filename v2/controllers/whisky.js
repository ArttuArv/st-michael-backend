const whiskyRouter = require('express').Router()
const whiskyCsvSql = require('../models/whisky')

whiskyRouter.get('/', (request, response) => {
  
  whiskyCsvSql.getAllWhiskys((err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    const sortedWhiskys = sortIntoCategories(result)
    response.json(sortedWhiskys)
  })
})

whiskyRouter.post('/', (request, response) => {
  const { name, area, price } = request.body

  if (!name || !area) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newWhisky = {
    name,
    area,
    price,
  }

  whiskyCsvSql.createWhisky(newWhisky, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'whisky not created', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...newWhisky })
  })
})

whiskyRouter.put('/:id', (request, response) => {
  const { name, area, price } = request.body

  if (!name || !area) {
    return response.status(400).json({ error: 'content missing' })
  }

  const whisky = {
    id: request.params.id,
    name,
    area,
    price,
  }

  whiskyCsvSql.updateWhisky(whisky, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'whisky not updated', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...whisky })
  })
})

whiskyRouter.delete('/:id', (request, response) => {  
  whiskyCsvSql.deleteWhisky(request.params.id, (err, result) => {
    if (err) {
      return response.status(404).json({ error: 'whisky not found' })
    }
    response.status(204).end()
  })
})


module.exports = whiskyRouter

const sortIntoCategories = (whiskys) => {
  // Create an empty object to store the transformed result
  const transformedResult = {};

  // Iterate through the actual result array
  whiskys.forEach((whisky) => {
    // Extract relevant information
    const { whisky_id, name, price, area, area_id } = whisky;

    // Check if the area exists in the transformed result object
    if (!transformedResult[area]) {
      // If not, create a new entry for the area
      transformedResult[area] = {
        id: area_id,
        area: area,
        total: 0,
        products: [],
      };
    }

    // Add the beer details to the products array of the area
    transformedResult[area].products.push({
      id: whisky_id,
      name: name,
      price: price,
      area: area,
    });
  });

  // Convert the transformed result into an array
  const transformedArray = Object.values(transformedResult);

  // Sort the array by id
  transformedArray.sort((a, b) => a.id - b.id);

  // Sort the products array of each area by id
  transformedArray.forEach((area) => {
    area.products.sort((a, b) => a.id - b.id);
  });

  // add a total amount of products to each area
  transformedArray.forEach((area) => {
    area.total = area.products.length;
  });

  return transformedArray;
};