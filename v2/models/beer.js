const { mySqlConnection } = require('../../utils/dbConn')

const getBeer = (id, callback) => {
  const selectQuery = `SELECT beers.beer_id AS id, beers.name, beers.style, beers.country, beer_categories.name AS category
    FROM beer_categories 
    INNER JOIN beers ON beers.category_id=beer_categories.category_id
    WHERE beers.beer_id = ?`
  return mySqlConnection.query(selectQuery, [id], callback)
}

const getBeers = (callback) => {
  // const selectQuery = 'SELECT * FROM beers'
  const selectQuery = 
    `SELECT beers.beer_id, beers.name, beers.style, beers.country, beer_categories.name AS category, beer_categories.category_id
    FROM beer_categories 
    INNER JOIN beers ON beers.category_id=beer_categories.category_id`
  return mySqlConnection.query(selectQuery, callback)
}

const createBeer = (beer, callback) => {
  const insertQuery = `INSERT INTO beers (category_id, name, style, country)
    VALUES ((SELECT category_id FROM beer_categories WHERE name = ?),?, ?, ?)`

  mySqlConnection.query(insertQuery, [beer.category, beer.name, beer.style, beer.country], (error, results) => {
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
  const updateQuery = `UPDATE beers 
    SET category_id = (SELECT category_id FROM beer_categories WHERE name = ?), name = ?, style = ?, country = ?
    WHERE beer_id = ?`

  return mySqlConnection.query(updateQuery, [beer.category, beer.name, beer.style, beer.country, beer.id], callback)
}

const deleteBeer = (id, callback) => {
  const deleteQuery = 'DELETE FROM beers WHERE beer_id = ?'
  return mySqlConnection.query(deleteQuery, [id], callback)
}

module.exports = {
  getBeer,
  getBeers,
  createBeer,
  updateBeer,
  deleteBeer,
}