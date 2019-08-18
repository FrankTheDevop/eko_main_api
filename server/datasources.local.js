'use strict'
const config = require('config')

const datasources = {}

const log = (...msg) => console.log('[datasources]', ...msg)

if (config.has('api') && config.has('api.dataSources.mongodb') && config.get('api.dataSources.mongodb.url')) {
  log('Data sources: Using MongoDB config', config.get('api.dataSources.mongodb'))
  datasources.db = {
    connector: 'loopback-connector-mongodb',
    url: config.get('api.dataSources.mongodb.url'),
    name: 'db',
    ssl: true,
  }
}

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
  datasources.proxy = {
    'name': 'proxy',
    'baseURL': '',
    'crud': false,
    'connector': 'rest',
    'operations': [
      {
        'template': {
          'method': 'GET',
          'url': config.get('api.dataSources.proxy_load_balancer.url'),
        },
        'functions': {
          'getNext': [],
        },
      },
    ],
  }
}

module.exports = datasources
