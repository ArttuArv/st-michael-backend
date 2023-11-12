// Beer queries
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

// Whisky queries
const getAllWhiskysQuery =
  `SELECT whiskys.whisky_id, whiskys.name, whiskys.price, whisky_areas.name AS area, whisky_areas.id_areas AS area_id
    FROM whisky_areas 
    INNER JOIN whiskys ON whiskys.areas_id=whisky_areas.id_areas`

const insertWhiskyQuery =
  `INSERT INTO whiskys (areas_id, name, price)
    VALUES ((SELECT id_areas FROM whisky_areas WHERE name = ?), ?, ?)`

const updateWhiskyQuery =
  `UPDATE whiskys 
    SET areas_id = (SELECT id_areas FROM whisky_areas WHERE name = ?), name = ?, price = ?
    WHERE whisky_id = ?`

const deleteWhiskyQuery =
  'DELETE FROM whiskys WHERE whisky_id = ?'

const insertWhiskyAreaQuery =
  `INSERT INTO whisky_areas (name)
    VALUES (?)`

const truncateWhiskyTable =
  `TRUNCATE TABLE whiskys`

const truncateWhiskyAreaTable =
  `TRUNCATE TABLE whisky_areas`

// Live Events queries
const getAllLiveEventsQuery =
  `SELECT id_events AS id, name, date, time FROM live_events`

const getLiveEventByIdQuery =
  `SELECT id_events AS id, name, date, time FROM live_events WHERE id_events = ?`

const insertLiveEventQuery =
  `INSERT INTO live_events (name, date, time)
    VALUES (?, ?, ?)`

const updateLiveEventQuery =
  `UPDATE live_events 
    SET name = ?, date = ?, time = ?
    WHERE id_events = ?`

const deleteLiveEventQuery =
  'DELETE FROM live_events WHERE id_events = ?'

// Opening Hours queries
const getAllOpeningHoursQuery =
  `SELECT openinghours_id AS id, day, opening_hours AS openinghours FROM openinghours`

const getOpeningHoursByIdQuery =
  `SELECT openinghours_id AS id, day, opening_hours AS openinghours FROM openinghours WHERE openinghours_id = ?`

const insertOpeningHoursQuery =
  `INSERT INTO openinghours (day, opening_hours)
    VALUES (?, ?)`

const updateOpeningHoursQuery =
  `UPDATE openinghours 
    SET day = ?, openinghours = ?
    WHERE openinghours_id = ?`

const deleteOpeningHoursQuery =
  'DELETE FROM openinghours WHERE openinghours_id = ?'

// User queries
const getAllUsersQuery =
  `SELECT users_id AS id, username FROM users`

const getUserByIdQuery =
  `SELECT users_id AS id, username, refresh_token AS refreshToken FROM users WHERE users_id = ?`

const getUserByUsernameQuery =
  `SELECT users_id AS id, username, password, refresh_token AS refreshToken FROM users WHERE username = ?`

const getUserByRefreshTokenQuery =
  `SELECT users_id AS id, username, password, refresh_token AS refreshToken FROM users WHERE refresh_token = ?`

const insertUserQuery =
  `INSERT INTO users (username, password)
    VALUES (?, ?)`

const updateUserQuery =
  `UPDATE users 
    SET username = ?, password = ?, refresh_token = ?
    WHERE users_id = ?`

const updateUserRefreshTokenQuery =
  `UPDATE users 
    SET refresh_token = ?
    WHERE users_id = ?`

const deleteUserQuery =
  'DELETE FROM users WHERE users_id = ?'

const loginQuery =
  `SELECT users_id AS id, username, password, refresh_token AS refreshToken FROM users WHERE username = ?`


module.exports = {
  selectBeerByIdQuery,
  selectBeersQuery,
  insertBeerQuery,
  updateBeerQuery,
  deleteBeerQuery,
  insertWhiskyQuery,
  insertWhiskyAreaQuery,
  truncateWhiskyTable,
  truncateWhiskyAreaTable,
  getAllWhiskysQuery,
  updateWhiskyQuery,
  deleteWhiskyQuery,
  getAllLiveEventsQuery,
  getLiveEventByIdQuery,
  insertLiveEventQuery,
  updateLiveEventQuery,
  deleteLiveEventQuery,
  getAllOpeningHoursQuery,
  getOpeningHoursByIdQuery,
  insertOpeningHoursQuery,
  updateOpeningHoursQuery,
  deleteOpeningHoursQuery,
  getAllUsersQuery,
  getUserByIdQuery,
  getUserByUsernameQuery,
  insertUserQuery,
  updateUserQuery,
  deleteUserQuery,
  loginQuery,
  getUserByRefreshTokenQuery,
  updateUserRefreshTokenQuery,
}