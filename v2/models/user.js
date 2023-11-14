const { mySqlConnection } = require('../../utils/dbConn')
const {
  getAllUsersQuery,
  insertUserQuery,
  updateUserQuery,
  deleteUserQuery,
  getUserByIdQuery,
  getUserByUsernameQuery,
  getUserByRefreshTokenQuery,
  updateUserRefreshTokenQuery,
  updateUserPasswordQuery,
} = require('../../utils/queries')
const bcrypt = require('bcrypt')

const getAllUsers = (callback) => {
  return mySqlConnection.query(getAllUsersQuery, callback)
}

const getUserById = (id, callback) => {
  return mySqlConnection.execute(getUserByIdQuery, [id], callback)
}

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.execute(getUserByUsernameQuery, [username], (err, result) => {
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
    mySqlConnection.execute(getUserByRefreshTokenQuery, [refreshToken], (err, result) => {
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
        mySqlConnection.execute(insertUserQuery, [user.username, passwordHash], (err, result) => {
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

    mySqlConnection.execute(getUserByUsernameQuery, [user.username], (err, result) => {
      if (err) {
        reject(err)
      } else {
        const userFound = result[0]

        user = {
          ...user,
          id: userFound.id,
        }

        bcrypt.hash(user.password, saltRounds, (err, passwordHash) => {
          if (err) {
            reject(err)
          } else {
            mySqlConnection.execute(updateUserPasswordQuery, [passwordHash, user.id], (err, result) => {
              if (err) {
                reject(err)
              } else {
                resolve(result)
              }    
            })
          }
        })
      }
    })
  })  
}

const updateUserRefreshToken = async (user) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.execute(updateUserRefreshTokenQuery, [user.refreshToken, user.id], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }    
    })
  })
}

const deleteUser = (id, callback) => {
  return mySqlConnection.execute(deleteUserQuery, [id], callback)
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserByRefreshToken,
  updateUserRefreshToken,
}

