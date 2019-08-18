'use strict';

const Promise = require('bluebird')

const logger = require('../../server/modules/getLogger')('models/user.js')
const helper = require('../../server/modules/helper')


module.exports = function(Client) {
  Client.findEntryByMail = (email) => {
    const conditions = {
      where: {
        email,
      },
    }

    return Client.findOne(conditions)
  }

  Client.doesItAlreadyExist = async (email) => {
    const entry = await Client.findEntryByMail(email)

    return !helper.doWeNeedToGetTheEntry(entry)
  }

  Client.saveIt = (email, token, password) => {
    const data = {
      email,
      token,
      password,
    }


    return Client.create(data)
  }

  Client.register = async (email, password) => {
    const TokenService = Client.app.dataSources.token_service

    const exists = await Client.doesItAlreadyExist(email)

    if (exists) {
      return Promise.reject(new Error('Client already exists'))
    } else {
      const data = await TokenService.generateToken(email)

      const entry = await Client.saveIt(email, data.token, password)
      return Promise.resolve(entry)
    }
  }
};
