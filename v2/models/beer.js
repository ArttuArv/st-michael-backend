const { mySqlConnection } = require('../../utils/dbConn')
const { 
  selectBeerByIdQuery, 
  selectBeersQuery, 
  insertBeerQuery, 
  updateBeerQuery, 
  deleteBeerQuery 
} = require('../../utils/queries')

const getBeerById = (id, callback) => {  
  return mySqlConnection.query(selectBeerByIdQuery, [id], callback)
}

const getBeers = (callback) => { 
  return mySqlConnection.query(selectBeersQuery, callback)
}

const createBeer = (beer, callback) => {
  mySqlConnection.query(insertBeerQuery, [beer.category, beer.name, beer.style, beer.country], (error, results) => {
    if (error) {
      return error.message.includes(`Column 'category_id' cannot be null`)
        ? callback(new Error(`Category with name '${beer.category}' not found.`), null)
        : callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

const updateBeer = (beer, callback) => { 
  return mySqlConnection.query(updateBeerQuery, [beer.category, beer.name, beer.style, beer.country, beer.id], callback)
}

const deleteBeer = (id, callback) => {  
  return mySqlConnection.query(deleteBeerQuery, [id], callback)
}

module.exports = {
  getBeerById,
  getBeers,
  createBeer,
  updateBeer,
  deleteBeer,
}