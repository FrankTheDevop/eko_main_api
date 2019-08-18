// Copyright IBM Corp. 2013,2018. All Rights Reserved.
// Node module: loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict'
let assert = require('assert')
let expect = require('../../helpers/expect')
let loopback = require('../../../node_modules/loopback/index')
let Scope = loopback.Scope
let ACL = loopback.ACL
let request = require('supertest')
let Promise = require('bluebird')
let supertest = require('supertest')
let Role = loopback.Role
let RoleMapping = loopback.RoleMapping
let User = loopback.User
let testModel
const sinon = require('sinon')

const helper = require('../../../server/modules/helper')

// Speed up the password hashing algorithm for tests
User.settings.saltWorkFactor = 4

function checkResult(err, result) {
  // console.log(err, result);
  assert(!err)
}

let ds = null
let model = null

before(function() {
  ds = loopback.createDataSource({ connector: loopback.Memory })
})

describe('checkPayload', function() {
  it('works correctly for a correct json string', () => {

    let expectedResult = {
      myVar: 123,
    }

    let payload = '{ "myVar": 123 }'

    const result = helper.checkPayload(payload)

    expect(typeof result).to.equal('object')
    expect(result).to.have.property('myVar', expectedResult.myVar)
  })

  it('works correctly for a incorrect json string', () => {

    let expectedResult = '{ myVar: 123 }'

    let payload = '{ myVar: 123 }'

    const result = helper.checkPayload(payload)

    expect(typeof result).to.equal('string')
    expect(result).to.equal(expectedResult)
  })

  it('works correctly for a json object', () => {

    let expectedResult = {
      myVar: 123,
    }

    let payload = { myVar: 123 }

    const result = helper.checkPayload(payload)

    expect(typeof result).to.equal('object')
    expect(result).to.have.property('myVar', expectedResult.myVar)
  })

})

describe('validValue', function() {
  it('detects a null value correctly', () => {

    let expectedResult = false

    let variable = null

    const result = helper.validValue(variable)

    expect(result).to.equal(expectedResult)
  })

  it('detects a undefined value correctly', () => {

    let expectedResult = false

    let variable = undefined

    const result = helper.validValue(variable)

    expect(result).to.equal(expectedResult)
  })

  it('detects a string value correctly', () => {

    let expectedResult = true

    let variable = 'test'

    const result = helper.validValue(variable)

    expect(result).to.equal(expectedResult)
  })

  it('detects a json value correctly', () => {

    let expectedResult = true

    let variable = {
      test: 1,
    }

    const result = helper.validValue(variable)

    expect(result).to.equal(expectedResult)
  })

})
