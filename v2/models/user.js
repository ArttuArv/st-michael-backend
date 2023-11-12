const { mySqlConnection } = require('../../utils/dbConn')
const {
  getAllUsersQuery,
  insertUserQuery,
  updateUserQuery,
  deleteUserQuery,
  getUserByIdQuery,
  getUserByUsernameQuery,
  getUserByRefreshTokenQuery
} = require('../../utils/queries')
const bcrypt = require('bcrypt')

const getAllUsers = (callback) => {
  return mySqlConnection.query(getAllUsersQuery, callback)
}

const getUserById = (id, callback) => {
  return mySqlConnection.query(getUserByIdQuery, [id], callback)
}

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(getUserByUsernameQuery, [username], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result[0])
      }
    })
  })
}

const getUserByRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(getUserByRefreshTokenQuery, [refreshToken], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result[0])
      }
    })
  })
}

const createUser = async (user) => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10

    bcrypt.hash(user.password, saltRounds, (err, passwordHash) => {
      if (err) {
        reject(err)
      } else {
        mySqlConnection.query(insertUserQuery, [user.username, passwordHash], (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      }
    })
  })
}

const updateUser = async (user, callback) => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10

    bcrypt.hash(user.password, saltRounds, (err, passwordHash) => {
      if (err) {
        reject(err)
      } else {
        mySqlConnection.query(updateUserQuery, [user.username, passwordHash, user.refreshToken, user.id], (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }    
        })
      }
    })
  })  
}

const deleteUser = (id, callback) => {
  return mySqlConnection.query(deleteUserQuery, [id], callback)
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserByRefreshToken
}

