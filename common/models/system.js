'use strict'

const Promise = require('bluebird')

const logger = require('../../server/modules/getLogger')('models/system.js')
const helper = require('../../server/modules/helper')

module.exports = function (System) {
  System.consumerStart = function (payload) {
    const Jobs = Post.app.models.job
    payload = helper.checkPayload(payload)

    logger.debug(payload)
    const {dt, a} = payload

    return Promise.resolve()
  }
}
