const { mySqlConnection } = require('../../utils/dbConn')
const { 
  selectBeerByIdQuery, 
  selectBeersQuery, 
  insertBeerQuery, 
  updateBeerQuery, 
  deleteBeerQuery 
} = require('../../utils/queries')

const getBeerById = (id, callback) => {  
  return mySqlConnection.execute(selectBeerByIdQuery, [id], callback)
}

const getBeers = (callback) => { 
  return mySqlConnection.query(selectBeersQuery, callback)
}

const createBeer = async (newBeer) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.execute(insertBeerQuery, [newBeer.category, newBeer.name, newBeer.style, newBeer.country], (error, results) => {
      if (error) {
        return error.message.includes(`Column 'category_id' cannot be null`)
          ? reject(new Error(`Category with name '${newBeer.category}' not found.`))
          : reject(error);
      } else {
        resolve(results);
      }
    }
  )})
}

const updateBeer = async (updatedBeer) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.execute(updateBeerQuery, [updatedBeer.category, updatedBeer.name, updatedBeer.style, updatedBeer.country, updatedBeer.id], (error, results) => {
      if (error) {
        return error.message.includes(`Column 'category_id' cannot be null`)
          ? reject(new Error(`Category with name '${updatedBeer.category}' not found.`))
          : reject(error);
      } else {
        resolve(results);
      }
    }
  )})
}

const deleteBeer = (id, callback) => {  
  return mySqlConnection.execute(deleteBeerQuery, [id], callback)
}

module.exports = {
  getBeerById,
  getBeers,
  createBeer,
  updateBeer,
  deleteBeer,
}