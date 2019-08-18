'use strict'
const config = require('config')

const datasources = {}

const log = (...msg) => console.log('[datasources]', ...msg)

if (config.has('api.dataSources') && config.has('api.dataSources.mysqldb') && config.has('api.dataSources.mysqldb.url')) {
  log('Data sources: Using MySQL config', config.get('api.dataSources.mysqldb.url'))
  datasources.db = {
    name: 'db',
    url: config.get('api.dataSources.mysqldb.url'),
    connector: 'mysql',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  }
}

if (config.has('api.dataSources') && config.has('api.dataSources.proxy_load_balancer') && config.has('api.dataSources.proxy_load_balancer.url') && config.has('api.dataSources.proxy_load_balancer.baseUrl')) {
  log('Data sources: Using Proxy config', config.get('api.dataSources.proxy_load_balancer'))
  datasources.token_service = {
    'name': 'token_service',
    'baseURL': '',
    'crud': false,
    'connector': 'rest',
    "operations": [
      {
        "template": {
          "method": "GET",
          "url": `${config.get('api.dataSources.token_service.url')}/api/Systems/generateToken`,
          "query": {
            "email": "{!email}"
          }
        },
        "functions": {
          "generateToken": [
            "email"
          ]
        }
      }
    ]
  }
}

datasources.qrcode_service = {
  'name': 'qrcode_service',
  'baseURL': '',
  'crud': false,
  'connector': 'rest',
  "operations": [
    {
      "template": {
        "method": "GET",
        "url": `${config.get('api.dataSources.qrcode_service.url')}/api/Systems/generateQrCode`,
        "query": {
          "email": "{!email}",
          "token": "{!token}"
        }
      },
      "functions": {
        "generateQrCode": [
          "email",
          "token"
        ]
      }
    },
    {
      "template": {
        "method": "GET",
        "url": `${config.get('api.dataSources.qrcode_service.url')}/api/Systems/getPublicQRCodePath`,
        "query": {
          "email": "{!email}"
        }
      },
      "functions": {
        "getPublicQRCodePath": [
          "email"
        ]
      }
    }
  ]
}
module.exports = datasources
