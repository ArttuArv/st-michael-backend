const selectBeerByIdQuery =
  `SELECT beers.beer_id AS id, beers.name, beers.style, beers.country, beer_categories.name AS category
    FROM beer_categories 
    INNER JOIN beers ON beers.category_id=beer_categories.category_id
    WHERE beers.beer_id = ?`

const selectBeersQuery =
  `SELECT beers.beer_id, beers.name, beers.style, beers.country, beer_categories.name AS category, beer_categories.category_id
    FROM beer_categories 
    INNER JOIN beers ON beers.category_id=beer_categories.category_id`

const insertBeerQuery = 
  `INSERT INTO beers (category_id, name, style, country)
    VALUES ((SELECT category_id FROM beer_categories WHERE name = ?), ?, ?, ?)`

const updateBeerQuery =
  `UPDATE beers 
    SET category_id = (SELECT category_id FROM beer_categories WHERE name = ?), name = ?, style = ?, country = ?
    WHERE beer_id = ?`

const deleteBeerQuery = 
  'DELETE FROM beers WHERE beer_id = ?'

module.exports = {
  selectBeerByIdQuery,
  selectBeersQuery,
  insertBeerQuery,
  updateBeerQuery,
  deleteBeerQuery,
}