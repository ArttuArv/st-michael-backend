const { mySqlConnection } = require('../../utils/dbConn')
const {
  getAllLiveEventsQuery,
  insertLiveEventQuery,
  updateLiveEventQuery,
  deleteLiveEventQuery,
} = require('../../utils/queries')

const getAllLiveEvents = (callback) => {
  return mySqlConnection.query(getAllLiveEventsQuery, callback)
}

const createLiveEvent = (liveEvent, callback) => {
  return mySqlConnection.execute(insertLiveEventQuery, [liveEvent.name, liveEvent.date, liveEvent.time], callback)
}

const updateLiveEvent = (liveEvent, callback) => {
  return mySqlConnection.execute(updateLiveEventQuery, [liveEvent.name, liveEvent.date, liveEvent.time, liveEvent.id], callback)
}

const deleteLiveEvent = (id, callback) => {
  return mySqlConnection.execute(deleteLiveEventQuery, [id], callback)
}

module.exports = {
  getAllLiveEvents,
  createLiveEvent,
  updateLiveEvent,
  deleteLiveEvent,
}