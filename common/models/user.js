'use strict';

const Promise = require('bluebird')

const logger = require('../../server/modules/getLogger')('models/user.js')
const helper = require('../../server/modules/helper')


module.exports = function(User) {
  User.findEntryByMail = (email) => {
    const conditions = {
      where: {
        email,
      },
    }

    return User.findOne(conditions)
  }

  User.doesItAlreadyExist = async (email) => {
    const entry = await User.findEntryByMail(email)

    return helper.doWeNeedToGetTheEntry(entry)
  }

  User.saveIt = (email) => {
    const data = {
      email,
    }

    return User.create(data)
  }

  User.register = async (email) => {
    const exists = await User.doesItAlreadyExist(email)

    if (exists) {
      return Promise.reject(new Error('User already exists'))
    } else {
      const entry = await User.saveIt(email)
      return Promise.resolve(entry)
    }
  }
};
